class APIFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }
  search() {
    const keyword = this.queryStr.keyword
      ? { $or: [
          { name: { $regex: this.queryStr.keyword, $options: 'i' } },
          { description: { $regex: this.queryStr.keyword, $options: 'i' } },
          { tags: { $regex: this.queryStr.keyword, $options: 'i' } },
        ] }
      : {};
    this.query = this.query.find({ ...keyword });
    return this;
  }
  filter() {
    const queryCopy = { ...this.queryStr };
    const { minPrice, maxPrice } = queryCopy;
    ['keyword', 'page', 'limit', 'sort', 'minPrice', 'maxPrice'].forEach((k) => delete queryCopy[k]);
    if (minPrice || maxPrice) {
      queryCopy.price = {};
      if (minPrice) queryCopy.price.$gte = Number(minPrice);
      if (maxPrice) queryCopy.price.$lte = Number(maxPrice);
    }
    let queryStr = JSON.stringify(queryCopy);
    queryStr = queryStr.replace(/(?<!\$)\b(gt|gte|lt|lte)\b/g, (m) => `$${m}`);
    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }
  sort() {
    this.query = this.queryStr.sort
      ? this.query.sort(this.queryStr.sort.split(',').join(' '))
      : this.query.sort('-createdAt');
    return this;
  }
  paginate(resPerPage) {
    const currentPage = Number(this.queryStr.page) || 1;
    const skip = resPerPage * (currentPage - 1);
    this.query = this.query.limit(resPerPage).skip(skip);
    return this;
  }
}
export default APIFeatures;