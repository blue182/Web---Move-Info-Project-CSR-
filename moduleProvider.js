const API_DOMAIN = "http://matuan.online:2422/api/";

export class DBProvider {
  constructor() {
    this.baseURL = API_DOMAIN;
    this.cache = {};
  }

  async fetchRawData(endpoint) {
    if (this.cache[endpoint]) return this.cache[endpoint];

    const url = `${this.baseURL}/${endpoint}`;
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Failed to fetch data from ${url}`);
      const data = await response.json();
      this.cache[endpoint] = data; // Cache the data
      return data;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

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
      case "mostpopular":
        endpoint = "MostPopularMovies";
        break;
      case "topboxoffice":
        endpoint = "Movies";
        break;
      default:
        throw new Error(`Unsupported class: ${cls}`);
    }
    console.log("Endponit: ", endpoint);
    const rawData = await this.fetchRawData(endpoint);
    let filteredData = rawData;
    console.log("Class: ", cls);

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
          item.title.toLowerCase().includes(pattern.toLowerCase())
        );
      }
    } else if (type === "detail" && pattern) {
      const detail = rawData.find((item) => item.id === pattern);
      return detail ? { detail } : { error: "Not found" };
    }

    const page = parseInt(params.page || 1, 10);
    const perPage = parseInt(params.per_page || 10, 10);
    const paginatedData = this.paginateData(filteredData, page, perPage);

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
