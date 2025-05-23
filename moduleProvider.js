const API_DOMAIN = "http://matuan.online:2422/api/";

export class DBProvider {
  constructor() {
    this.baseURL = API_DOMAIN;
    this.cache = {};
  }

  /**
   * Fetch raw data from server and cache it.
   * @param {String} endpoint - API endpoint to fetch data.
   * @returns {Array} - Array of raw data from server.
   */
  async fetchRawData(endpoint) {
    if (this.cache[endpoint]) return this.cache[endpoint];

    const url = `${this.baseURL}/${endpoint}`;
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Failed to fetch data from ${url}`);
      const data = await response.json();
      this.cache[endpoint] = data;
      return data;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  /**
   * Parse the input query into components.
   * @param {String} query - Input query string.
   * @returns {Object} - Parsed query components.
   */
  parseQuery(query) {
    const [path, params] = query.split("?");
    const [type, cls, pattern] = path.split("/");
    const paramsObject = params
      ? Object.fromEntries(new URLSearchParams(params))
      : {};

    return {
      type,
      class: cls,
      pattern: pattern || "",
      params: paramsObject,
    };
  }

  /**
   * Paginate data.
   * @param {Array} data - Array of data.
   * @param {Number} page - Current page number (1-based).
   * @param {Number} perPage - Number of items per page.
   * @returns {Object} - Paginated result.
   */
  paginateData(data, page = 1, perPage = 10) {
    const total = data.length;
    const totalPage = Math.ceil(total / perPage);
    const start = (page - 1) * perPage;
    const end = start + perPage;

    return {
      items: data.slice(start, end),
      total,
      totalPage,
      currentPage: page,
    };
  }

  /**
   * Fetch data based on query.
   * @param {String} query - Input query string.
   * @returns {Object} - Processed result with required format.
   */
  async fetch(query) {
    const { type, class: cls, pattern, params } = this.parseQuery(query);

    let endpoint;
    switch (cls) {
      case "movie":
        endpoint = "Movies";
        break;
      case "name":
        if (type === "search") {
          endpoint = "Movies";
        } else {
          endpoint = "Names";
        }
        break;
      case "top50":
        endpoint = "Top50Movies";
        break;
      case "review":
        endpoint = "Reviews";
        break;
      case "mostpopular":
        endpoint = "MostPopularMovies";
        break;
      case "topboxoffice":
        endpoint = "Movies";
        break;
      case "actor-movies":
        endpoint = "Movies";
        break;
      default:
        throw new Error(`Unsupported class: ${cls}`);
    }
    const rawData = await this.fetchRawData(endpoint);
    let filteredData = rawData;

    if (cls === "topboxoffice") {
      filteredData = rawData
        .filter(
          (item) => item.boxOffice && item.boxOffice.cumulativeWorldwideGross
        )
        .sort((a, b) => {
          const grossA = parseInt(
            a.boxOffice.cumulativeWorldwideGross.replace(/[^\d.-]/g, ""),
            10
          );
          const grossB = parseInt(
            b.boxOffice.cumulativeWorldwideGross.replace(/[^\d.-]/g, ""),
            10
          );
          return grossB - grossA;
        });
    }
    if (type === "search" && pattern) {
      if (cls === "name") {
        filteredData = rawData.filter((item) =>
          item.actorList.some((actor) =>
            actor.name.toLowerCase().includes(pattern.toLowerCase())
          )
        );
      }
      if (cls === "movie") {
        filteredData = rawData.filter((item) =>
          item.title
            .toLowerCase()
            .replace(/\s+/g, " ")
            .includes(pattern.toLowerCase())
        );
      }
    } else if (type === "detail" && pattern) {
      const detail = rawData.find((item) => item.id === pattern);
      return detail ? { detail } : { error: "Not found" };
    }

    if (cls === "actor-movies" && pattern) {
      filteredData = rawData.filter((movie) =>
        movie.actorList.some((actor) => {
          if (actor.id === pattern) {
            movie.roleOfActor = actor.asCharacter;
            return true;
          }
          return false;
        })
      );

      if (filteredData.length === 0) {
        return { error: `No movies found for actorId: ${pattern}` };
      }
    }

    const page = parseInt(params.page || 1, 10);
    const perPage = parseInt(params.per_page || 10, 10);
    const paginatedData = this.paginateData(filteredData, page, perPage);

    if (type === "review" && pattern) {
      const filteredReviews = rawData.filter(
        (review) => review.movieId === pattern
      );

      if (filteredReviews.length === 0) {
        return { error: `No reviews found for movieId: ${pattern}` };
      }

      return filteredReviews ? { filteredReviews } : { error: "Not found" };
    }

    if (type === "search") {
      return {
        search: pattern,
        page: paginatedData.currentPage,
        per_page: perPage,
        total: paginatedData.total,
        total_page: paginatedData.totalPage,
        items: paginatedData.items,
      };
    } else {
      return {
        page: paginatedData.currentPage,
        per_page: perPage,
        total: paginatedData.total,
        total_page: paginatedData.totalPage,
        items: paginatedData.items,
      };
    }
  }
}
