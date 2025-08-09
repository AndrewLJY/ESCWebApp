// Validation helper functions
function isValidNumber(value) {
  valueCopy = value;
  // Check if string can be converted to a number and doesn't contain alphabets
  if (typeof valueCopy === "number") return true;
  return !isNaN(Number(valueCopy)) && !/[a-zA-Z]/.test(String(valueCopy));
}

function isValidString(value) {
  if (typeof value === "string" && /[a-zA-Z]/.test(String(value))) {
    return true;
  }
  return false;
}

function isValidBoolean(bool) {
  if (bool === true || bool === false) {
    return true;
  }
  return false;
}

function isValidLatitude(value) {
  // Latitude should be between -90 and 90
  return isValidNumber(value) && Math.abs(Number(value)) <= 90;
}

function isValidLongitude(value) {
  // Longitude should be between -180 and 180
  return isValidNumber(value) && Math.abs(Number(value)) <= 180;
}

function isValidPrice(value) {
  // Price should be a non-negative number
  return isValidNumber(value) && Number(value) >= 0;
}

function isNonEmptyString(value) {
  if (typeof value === "string" && value.length > 0) {
    return true;
  }

  return false;
}

function isValidArray(value) {
  if (!Array.isArray(value)) {
    return false;
  }
  for (let element in value) {
    if (!isNonEmptyString(element)) {
      return false;
    }
  }
  return true;
}

function isValidObject(value) {
  return value && typeof value === "object" && !Array.isArray(value);
}

function isValidJSON(value) {
  if (isValidObject(value)) return true;
  try {
    const parsed = JSON.parse(value);
    return isValidObject(parsed);
  } catch {
    return false;
  }
}

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

      setId(value) {
        if (!isNonEmptyString(value)) {
          throw new Error("Hotel ID must be a non-empty string");
        }
        this.id = value;
        return this;
      }

      setImageCount(value) {
        this.imageCount = Number(value);
        return this;
      }

      setLatitude(value) {
        if (value === null || value === undefined) {
          return this;
        }

        if (!isValidLatitude(value)) {
          throw new Error("Latitude must be a valid number between -90 and 90");
        }
        this.latitude = value;
        return this;
      }

      setLongitude(value) {
        if (value === null || value === undefined) {
          return this;
        }

        if (!isValidLongitude(value)) {
          throw new Error(
            "Longitude must be a valid number between -180 and 180"
          );
        }
        this.longitude = value;
        return this;
      }

      setName(value) {
        if (!isNonEmptyString(value) || value == null) {
          throw new Error("Name must be a non-empty string");
        }
        this.name = value;
        return this;
      }

      setAddress(value) {
        if (value === null || value === undefined) {
          return this;
        }
        if (!isNonEmptyString(value)) {
          throw new Error("Address must be a non-empty string");
        }
        this.address = value;
        return this;
      }

      setAddress1(value) {
        if (value === null || value === undefined) {
          return this;
        }
        if (!isNonEmptyString(value)) {
          throw new Error("Address1 must be a non-empty string");
        }
        this.address1 = value;
        return this;
      }

      setDescription(value) {
        if (value === null || value === undefined) {
          return this;
        }
        if (!isNonEmptyString(value)) {
          throw new Error("Description must be a non-empty string");
        }
        this.description = value;
        return this;
      }

      setDistance(value) {
        if (value === null || value === undefined) {
          return this;
        }
        if (!isValidNumber(value) || Number(value) < 0) {
          throw new Error("Distance must be a valid non-negative number");
        }
        this.distance = value;
        return this;
      }

      setId(id) {
        if (!isNonEmptyString(id)) {
          throw new Error("Hotel ID must be a non-empty string");
        }
        this.id = id;
        return this;
      }

      setRating(rating) {
        if (rating === null || rating === undefined) {
          return this;
        }

        if (!isValidNumber(rating)) {
          throw new Error("Rating is not a number");
        }

        // ratingCopy = rating;
        // if (Number(ratingCopy) >= 0 || Number(ratingCopy) <= 5) {
        //   throw new Error("Rating must be an integer between 0 and 5");
        // }
        this.rating = rating;
        return this;
      }
      setCheckinTime(checkin) {
        if (checkin === null || checkin === undefined) {
          return this;
        }
        // if (
        //   typeof checkin !== "string" ||
        //   !checkin.match(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]\s*(?:AM|PM)$/i)
        // ) {
        //   throw new Error('Check-in time must be in format "HH:MM AM/PM"');
        // }
        this.checkinTime = checkin;
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
        if (amenities === null || amenities === undefined) {
          return this;
        }
        //Else if it is not null but intentionally fuzzed values...
        if (!isValidObject(amenities)) {
          throw new Error("Invalid Amenities Parameters");
        }

        //If Amenities is a valid object but inside it doesnt follow the right format:
        if (!Object.keys(amenities).every((key) => isValidString(key))) {
          throw new Error("Invalid Amenities Parameters");
        }
        if (!Object.values(amenities).every((bool) => isValidBoolean(bool))) {
          throw new Error("Invalid Amenities Parameters");
        }

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

      setName(value) {
        if (value === null || value === undefined || value === "") {
          return this;
        }
        console.log("name", value);
        if (!isNonEmptyString(value)) {
          throw new Error("Name must be a non-empty string");
        }
        this.name = value;
        return this;
      }

      setCity(value) {
        if (value === null || value === undefined || value === "") {
          return this;
        }
        if (!isNonEmptyString(value)) {
          throw new Error("City must be a non-empty string");
        }
        this.city = value;
        return this;
      }

      setState(value) {
        if (value === null || value === undefined || value === "") {
          return this;
        }
        if (!isNonEmptyString(value)) {
          throw new Error("State must be a non-empty string");
        }
        this.state = value;
        return this;
      }

      setCountry(value) {
        if (value === null || value === undefined || value === "") {
          return this;
        }
        if (!isNonEmptyString(value)) {
          throw new Error("Country must be a non-empty string");
        }
        this.country = value;
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
    this.bNoAvailableImages = builder.bNoAvailableImages;
  }

  noAvailableImages() {
    return this.bNoAvailableImages;
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
        this.bNoAvailableImages = false;
      }

      setImageCounts(hiresImageIndex) {
        if (
          hiresImageIndex === null ||
          hiresImageIndex === undefined ||
          hiresImageIndex === ""
        ) {
          this.bNoAvailableImages = true;
          return this;
        }
        this.imageCounts = hiresImageIndex.split(",");
        return this;
      }

      setImageUrlPrefix(value) {
        if (!value) {
          this.bNoAvailableImages = true;
          return this;
        }
        this.imageUrlPrefix = value;
        return this;
      }

      setImageUrlSuffix(value) {
        if (!value) {
          this.bNoAvailableImages = true;
          return this;
        }
        this.imageUrlSuffix = value;
        return this;
      }

      stitchImageUrls() {
        if (this.bNoAvailableImages === true) {
          return this;
        }

        //Else:
        for (let index of this.imageCounts) {
          let oneStichedUrl = `${this.imageUrlPrefix}${index}${this.imageUrlSuffix}`;
          this.stitchedImageUrls.push(oneStichedUrl);
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

      setRank(value) {
        if (value === null || value === undefined || value === "") {
          return this;
        }
        if (!isValidNumber(value) || Number(value) < 0) {
          throw new Error("Rank must be a non-negative integer");
        }
        this.rank = value;
        return this;
      }

      setSearchRank(value) {
        if (value === null || value === undefined || value === "") {
          return this;
        }
        // if (!isValidInteger(value) || Number(value) < 0) {
        //   throw new Error("Search rank must be a non-negative integer");
        // }
        this.searchRank = value;
        return this;
      }

      setPriceType(value) {
        // if (
        //   value !== "Single" &&
        //   value !== "Double" &&
        //   value !== "Multi" &&
        //   value !== "single" &&
        //   value !== "double" &&
        //   value !== "multi"
        // ) {
        //   throw new Error("Price Type Parameters is invalid");
        // }
        this.priceType = value;
        return this;
      }

      setFreeCancellation(value) {
        console.log(value);
        if (
          value !== "true" &&
          value !== "false" &&
          value !== true &&
          value !== false
        ) {
          throw Error("Invalid Free Cancellation Parameter");
        }
        // Convert string 'true'/'false' to boolean if needed

        this.freeCancellation = value;
        return this;
      }

      setRoomsAvailable(value) {
        if (!isValidNumber(value) || Number(value) < 0) {
          throw new Error("Rooms available must be a non-negative integer");
        }
        this.roomsAvailable = value;
        return this;
      }

      setMaxCashPayment(value) {
        if (!isValidPrice(value)) {
          throw new Error("Max cash payment must be a non-negative number");
        }
        this.maxCashPayment = value;
        return this;
      }

      setConvertedMaxCashPayment(value) {
        if (!isValidPrice(value)) {
          throw new Error(
            "Converted max cash payment must be a non-negative number"
          );
        }
        this.convertedMaxCashPayment = value;
        return this;
      }

      setPoints(value) {
        if (value === null || value === undefined || value === "") {
          return this;
        }
        if (!isValidPrice(value)) {
          throw new Error("Points must be a non-negative number");
        }
        this.points = value;
        return this;
      }

      setBonuses(bonuses) {
        if (
          bonuses === null ||
          bonuses === undefined ||
          bonuses === "" ||
          bonuses == []
        ) {
          return this;
        }
        if (!isValidArray(bonuses)) {
          throw new Error("Bonuses must be an array of non-empty strings");
        }
        this.bonuses = bonuses;
        return this;
      }

      setBonusPrograms(value) {
        if (value === null || value === undefined || value === "") {
          return this;
        }
        if (!isValidArray(value, isNonEmptyString)) {
          throw new Error(
            "Bonus programs must be an array of non-empty strings"
          );
        }
        this.bonusPrograms = value;
        return this;
      }

      setBonusTiers(value) {
        if (
          value === null ||
          value === undefined ||
          value === "" ||
          value == []
        ) {
          return this;
        }
        if (!isValidArray(value, isNonEmptyString)) {
          throw new Error("Bonus tiers must be an array of non-empty strings");
        }
        this.bonusTiers = value;
        return this;
      }

      setLowestPrice(value) {
        if (!isValidPrice(value)) {
          throw new Error("Lowest price must be a non-negative number");
        }
        this.lowestPrice = value;
        return this;
      }

      setPrice(value) {
        if (!isValidPrice(value)) {
          throw new Error("Price must be a non-negative number");
        }
        this.price = value;
        return this;
      }

      setConvertedPrice(value) {
        if (!isValidPrice(value)) {
          throw new Error("Converted price must be a non-negative number");
        }
        this.convertedPrice = value;
        return this;
      }

      setLowestConvertedPrice(value) {
        if (!isValidPrice(value)) {
          throw new Error(
            "Lowest converted price must be a non-negative number"
          );
        }
        this.lowestConvertedPrice = value;
        return this;
      }

      setMarketRates(value) {
        if (
          value === null ||
          value === undefined ||
          value === "" ||
          value == []
        ) {
          return this;
        }
        // Validate that all rate values are non-negative numbers
        const hasValidRates = value.map((object) =>
          Object.values(object).every((rate) => isValidPrice(rate))
        );
        if (!hasValidRates) {
          throw new Error("All market rates must be non-negative numbers");
        }
        this.marketRates = value;
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

      setTrustYouId(value) {
        if (value == null) {
          return this;
        }
        if (!isNonEmptyString(value)) {
          throw new Error("TrustYou ID must be a non-empty string");
        }
        this.trustYouId = value;
        return this;
      }

      setTrustYouScoreParameters(value) {
        if (
          value === null ||
          value === undefined ||
          value === "" ||
          value == {}
        ) {
          return this;
        }
        if (!isValidJSON(value)) {
          throw new Error(
            "TrustYou score parameters must be a valid JSON object"
          );
        }
        this.score = typeof value === "string" ? JSON.parse(value) : value;
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
