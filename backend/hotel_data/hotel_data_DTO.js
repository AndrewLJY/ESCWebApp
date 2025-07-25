class HotelData {
  constructor(
    keyDetails,
    amenities,
    imageDetails,
    originalMetaData,
    pricingRankingData,
    trustYouBenchmark
  ) {
    this.keyDetails = keyDetails;
    this.amenities = amenities;
    this.imageDetails = imageDetails;
    this.originalMetaData = originalMetaData;
    this.pricingRankingData = pricingRankingData;
    this.trustYouBenchmark = trustYouBenchmark;
  }

  //Getters for each of these class fields
  getKeyDetails() {
    return this.keyDetails;
  }

  getAmenities() {
    return this.amenities;
  }

  getImageDetails() {
    return this.imageDetails;
  }

  getOriginalMetaData() {
    return this.originalMetaData;
  }

  getPricingRankingData() {
    return this.pricingRankingData;
  }

  getTrustYouBenchmark() {
    return this.trustYouBenchmark;
  }
}

class KeyDetails {
  constructor(builder) {
    this.id = builder.id;
    this.imageCount = builder.imageCount;
    this.latitude = builder.latitude;
    this.longitude = builder.longitude;
    this.name = builder.name;
    this.address = builder.address;
    this.address1 = builder.address1;
    this.checkinTime = builder.checkinTime;
    this.rating = builder.rating;
    this.distance = builder.distance;
    this.description = builder.description;
  }
  getId() {
    return this.id;
  }

  getImageCount() {
    return this.imageCount;
  }

  getLatitude() {
    return this.latitude;
  }

  getLongitude() {
    return this.longitude;
  }

  getName() {
    return this.name;
  }

  getAddress() {
    return this.address;
  }

  getAddress1() {
    return this.address1;
  }

  getCheckInTime() {
    return this.checkinTime;
  }

  getRating() {
    return this.rating;
  }

  getDistance() {
    return this.distance;
  }

  getDescription() {
    return this.description;
  }

  static get Builder() {
    return class {
      constructor() {
        this.id = null;
        this.imageCount = null;
        this.latitude = null;
        this.longitude = null;
        this.name = null;
        this.address = null;
        this.address1 = null;
        this.rating = null;
        this.description = null;
        this.distance = null;
      }

      setId(id) {
        this.id = id;
        return this;
      }

      setImageCount(imageCount) {
        this.imageCount = imageCount;
        return this;
      }

      setLatitude(latitude) {
        this.latitude = latitude;
        return this;
      }

      setLongitude(longitude) {
        this.longitude = longitude;
        return this;
      }

      setName(name) {
        this.name = name;
        return this;
      }

      setAddress(address) {
        this.address = address;
        return this;
      }

      setAddress1(address1) {
        this.address1 = address1;
        return this;
      }

      setRating(rating) {
        this.rating = rating;
        return this;
      }

      setDistance(distance) {
        this.distance = distance;
        return this;
      }

      setCheckinTime(checkin) {
        this.checkinTime = checkin;
        return this;
      }

      setDescription(description) {
        this.description = description;
        return this;
      }

      build() {
        return new KeyDetails(this);
      }
    };
  }
}

//Define classes for all of the more complicated data
class Amenities {
  //class constructor here
  constructor(builder) {
    this.amenities = builder.amenities;
  }

  getAmenities() {
    return this.amenities;
  }

  static get Builder() {
    return class {
      constructor() {
        this.amenities = null;
      }

      setAmenities(amenities) {
        this.amenities = amenities;
        return this;
      }

      build() {
        return new Amenities(this);
      }
    };
  }
}

class OriginalMetaData {
  constructor(builder) {
    this.name = builder.name;
    this.city = builder.city;
    this.state = builder.state;
    this.country = builder.country;
  }
  getName() {
    return this.name;
  }

  getCity() {
    return this.city;
  }

  getState() {
    return this.state;
  }

  getCountry() {
    return this.country;
  }

  static get Builder() {
    return class {
      constructor() {
        this.name = null;
        this.city = null;
        this.state = null;
        this.country = null;
      }

      setName(name) {
        this.name = name;
        return this;
      }

      setCity(city) {
        this.city = city;
        return this;
      }

      setState(state) {
        this.state = state;
        return this;
      }

      setCountry(country) {
        this.country = country;
        return this;
      }

      build() {
        return new OriginalMetaData(this);
      }
    };
  }
}

class ImageDetails {
  constructor(builder) {
    this.imageCounts = builder.imageCounts;
    this.imageUrlPrefix = builder.imageUrlPrefix;
    this.imageUrlSuffix = builder.imageUrlSuffix;
    this.stitchedImageUrls = builder.stitchedImageUrls;
  }

  getImageCounts() {
    return this.imageCounts;
  }

  getImageUrlPrefix() {
    return this.imageUrlPrefix;
  }

  getImageUrlSuffix() {
    return this.imageUrlSuffix;
  }

  getStitchedImageUrls() {
    return this.stitchedImageUrls;
  }

  static get Builder() {
    return class {
      constructor() {
        this.imageCounts = null;
        this.imageUrlPrefix = null;
        this.imageUrlSuffix = null;
        this.stitchedImageUrls = [];
      }

      setImageCounts(imageCount) {
        this.imageCounts = imageCount;
        return this;
      }

      setImageUrlPrefix(imageUrlPrefix) {
        this.imageUrlPrefix = imageUrlPrefix;
        return this;
      }

      setImageUrlSuffix(imageUrlSuffix) {
        this.imageUrlSuffix = imageUrlSuffix;
        return this;
      }

      stitchImageUrls() {
        if (this.imageUrlPrefix && this.imageUrlSuffix && this.imageCounts) {
          for (let i = 0; i < this.imageCounts; i++) {
            let oneStichedUrl = `${this.imageUrlPrefix}${i}${this.imageUrlSuffix}`;
            this.stitchedImageUrls.push(oneStichedUrl);
          }
        }
        return this;
      }

      build() {
        return new ImageDetails(this);
      }
    };
  }
}

class PricingRankingData {
  constructor(builder) {
    this.rank = builder.rank;
    this.searchRank = builder.searchRank;
    this.priceType = builder.priceType;
    this.freeCancellation = builder.freeCancellation;
    this.roomsAvailable = builder.roomsAvailable;
    this.maxCashPayment = builder.maxCashPayment;
    this.convertedMaxCashPayment = builder.convertedMaxCashPayment;
    this.points = builder.points;
    this.bonuses = builder.bonuses;
    this.bonusPrograms = builder.bonusPrograms;
    this.bonusTiers = builder.bonusTiers;
    this.lowestPrice = builder.lowestPrice;
    this.price = builder.price;
    this.convertedPrice = builder.convertedPrice;
    this.lowestConvertedPrice = builder.lowestConvertedPrice;
    this.marketRates = builder.marketRates;
  }

  getRank() {
    return this.rank;
  }

  getSearchRank() {
    return this.searchRank;
  }

  getPriceType() {
    return this.priceType;
  }

  getFreeCancellation() {
    return this.freeCancellation;
  }

  getRoomsAvailable() {
    return this.roomsAvailable;
  }

  getMaxCashPayment() {
    return this.maxCashPayment;
  }

  getConvertedMaxCashPayment() {
    return this.convertedMaxCashPayment;
  }

  getPoints() {
    return this.points;
  }

  getBonuses() {
    return this.bonuses;
  }

  getBonusPrograms() {
    return this.bonusPrograms;
  }

  getBonusTiers() {
    return this.bonusTiers;
  }

  getLowestPrice() {
    return this.lowestPrice;
  }

  getPrice() {
    return this.price;
  }

  getConvertedPrice() {
    return this.convertedPrice;
  }

  getLowestConvertedPrice() {
    return this.lowestConvertedPrice;
  }

  getMarketRates() {
    return this.marketRates;
  }

  static get Builder() {
    return class {
      constructor() {
        this.rank = null;
        this.searchRank = null;
        this.priceType = null;
        this.freeCancellation = null;
        this.roomsAvailable = null;
        this.maxCashPayment = null;
        this.convertedMaxCashPayment = null;
        this.points = null;
        this.bonuses = null;
        this.bonusPrograms = null;
        this.bonusTiers = null;
        this.lowestPrice = null;
        this.price = null;
        this.convertedPrice = null;
        this.lowestConvertedPrice = null;
        this.marketRates = null;
      }

      setRank(rank) {
        this.rank = rank;
        return this;
      }

      setSearchRank(searchRank) {
        this.searchRank = searchRank;
        return this;
      }

      setPriceType(priceType) {
        this.priceType = priceType;
        return this;
      }

      setFreeCancellation(freeCancellation) {
        this.freeCancellation = freeCancellation;
        return this;
      }

      setRoomsAvailable(roomsAvailable) {
        this.roomsAvailable = roomsAvailable;
        return this;
      }

      setMaxCashPayment(maxCashPayment) {
        this.maxCashPayment = maxCashPayment;
        return this;
      }

      setConvertedMaxCashPayment(convertedMaxCashPayment) {
        this.convertedMaxCashPayment = convertedMaxCashPayment;
        return this;
      }
      setPoints(points) {
        this.points = points;
        return this;
      }

      setBonuses(bonuses) {
        this.bonuses = bonuses;
        return this;
      }

      setBonusTiers(bonusTiers) {
        this.bonusTiers = bonusTiers;
        return this;
      }

      setLowestPrice(lowestPrice) {
        this.lowestPrice = lowestPrice;
        return this;
      }

      setPrice(price) {
        this.price = price;
        return this;
      }

      setConvertedPrice(convertedPrice) {
        this.convertedPrice = convertedPrice;
        return this;
      }

      setLowestConvertedPrice(lowestConvertedPrice) {
        this.lowestConvertedPrice = lowestConvertedPrice;
        return this;
      }

      setMarketRates(marketRates) {
        this.marketRates = marketRates;
        return this;
      }

      build() {
        return new PricingRankingData(this);
      }
    };
  }
}

class TrustYouBenchmark {
  constructor(builder) {
    this.trustYouId = builder.trustYouId;
    this.score = builder.score;
  }

  getTrustYouId() {
    return this.trustYouId;
  }

  getScore() {
    return this.score;
  }

  static get Builder() {
    return class {
      constructor() {
        this.trustYouId = null;
        this.score = null;
      }

      setTrustYouId(trustYouId) {
        this.trustYouId = trustYouId;
        return this;
      }

      setTrustYouScoreParameters(trustYouJSONString) {
        this.score = trustYouJSONString;
        return this;
      }

      build() {
        return new TrustYouBenchmark(this);
      }
    };
  }
}

module.exports = {
  HotelData,
  KeyDetails,
  Amenities,
  OriginalMetaData,
  ImageDetails,
  PricingRankingData,
  TrustYouBenchmark,
};
