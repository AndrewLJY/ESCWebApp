// Validation helper functions
function isValidUUID(uuid) {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return typeof uuid === "string" && uuidRegex.test(uuid);
}

function isValidPrice(value) {
  // Price should be a non-negative number
  return isValidNumber(value) && Number(value) >= 0;
}

function isNonEmptyString(str) {
  return typeof str === "string" && str.trim().length > 0;
}

function isValidNumber(value) {
  valueCopy = value;
  // Check if string can be converted to a number and doesn't contain alphabets
  if (typeof valueCopy === "number") return true;
  return !isNaN(Number(valueCopy)) && !/[a-zA-Z]/.test(String(valueCopy));
}

function isValidBoolean(val) {
  if (typeof val === "boolean") return true;
  if (val === "true" || val === "false" || val === true || val == false) {
    return true;
  }
  return false;
}

function isValidArray(arr, allowEmpty = true) {
  return Array.isArray(arr) && (allowEmpty || arr.length > 0);
}

function isValidBreakfastInfo(info) {
  const validTypes = [
    "hotel_detail_room_only",
    "hotel_detail_breakfast_included",
    "hotel_detail_breakfast_for_2_included",
  ];
  return typeof info === "string" && validTypes.includes(info);
}

class HotelRoomData {
  constructor(builder) {
    this.keyRoomDetails = builder.keyRoomDetails;
    this.priceDetails = builder.priceDetails;
    this.taxDetails = builder.taxDetails;
    this.roomAdditionalInfo = builder.roomAdditionalInfo;
  }

  getKeyRoomDetails() {
    return this.keyRoomDetails;
  }

  getPriceDetails() {
    return this.priceDetails;
  }

  getTaxDetails() {
    return this.taxDetails;
  }

  getRoomAdditionalInfo() {
    return this.roomAdditionalInfo;
  }

  static get Builder() {
    return class {
      constructor() {
        this.keyRoomDetails = null;
        this.priceDetails = null;
        this.taxDetails = null;
      }

      setKeyRoomDetails(keyRoomDetails) {
        this.keyRoomDetails = keyRoomDetails;
        return this;
      }

      setPriceDetails(priceDetails) {
        this.priceDetails = priceDetails;
        return this;
      }

      setTaxDetails(taxDetails) {
        this.taxDetails = taxDetails;
        return this;
      }

      setRoomAdditionalInfo(roomAdditionalInfo) {
        this.roomAdditionalInfo = roomAdditionalInfo;
        return this;
      }

      build() {
        return new HotelRoomData(this);
      }
    };
  }
}

class KeyRoomDetails {
  constructor(builder) {
    this.keyId = builder.keyId;
    this.roomDescription = builder.roomDescription;
    this.roomNormalisedDescription = builder.roomNormalisedDescription;
    this.roomTypeIndex = builder.roomTypeIndex;
    this.freeCancellation = builder.freeCancellation;
    this.longDescription = builder.longDescription;
    this.roomImages = builder.roomImages;
  }

  getKeyId() {
    return this.keyId;
  }

  getRoomImages() {
    return this.roomImages;
  }

  getRoomDescription() {
    return this.roomDescription;
  }

  getRoomNormalisedDescription() {
    return this.roomNormalisedDescription;
  }

  getRoomTypeIndex() {
    return this.roomTypeIndex;
  }

  getFreeCancellation() {
    return this.freeCancellation;
  }

  getLongDescription() {
    return this.longDescription;
  }

  static get Builder() {
    return class {
      constructor() {
        this.keyId = null;
        this.roomDescription = null;
        this.roomNormalisedDescription = null;
        this.roomTypeIndex = null;
        this.freeCancellation = null;
        this.longDescription = null;
        this.roomImages = null;
      }

      setKeyId(keyId) {
        if (!isValidUUID(keyId)) {
          throw new Error("Key ID must be a valid UUID string");
        }
        this.keyId = keyId;
        return this;
      }

      setRoomDescription(roomDescription) {
        if (!isNonEmptyString(roomDescription)) {
          throw new Error("Room description must be a non-empty string");
        }
        this.roomDescription = roomDescription;
        return this;
      }

      setRoomNormalisedDescription(roomNormalisedDescription) {
        if (!isNonEmptyString(roomNormalisedDescription)) {
          throw new Error(
            "Normalised room description must be a non-empty string"
          );
        }
        this.roomNormalisedDescription = roomNormalisedDescription;
        return this;
      }

      setRoomTypeIndex(roomTypeIndex) {
        if (
          !isNonEmptyString(roomTypeIndex) ||
          isNaN(parseInt(roomTypeIndex))
        ) {
          throw new Error("Room type index must be a numeric string");
        }
        this.roomTypeIndex = roomTypeIndex;
        return this;
      }

      setRoomImages(roomImages) {
        // if (roomImages !== null && !isValidArray(roomImages)) {
        //   throw new Error("Room images must be an array or null");
        // }
        this.roomImages = roomImages;
        return this;
      }

      setFreeCancellation(freeCancellation) {
        if (!isValidBoolean(freeCancellation)) {
          throw new Error("Free cancellation must be a boolean value");
        }
        this.freeCancellation =
          typeof freeCancellation === "string"
            ? freeCancellation.toLowerCase() === "true"
            : freeCancellation;
        return this;
      }

      setLongDescription(longDescription) {
        // Optional field, can be string or null
        if (longDescription !== null && !isNonEmptyString(longDescription)) {
          throw new Error(
            "Long description must be a non-empty string or null"
          );
        }
        this.longDescription = longDescription;
        return this;
      }

      build() {
        return new KeyRoomDetails(this);
      }
    };
  }
}

class RoomAdditionalInfo {
  constructor(builder) {
    this.breakfastInfo = builder.breakfastInfo;
    this.specialCheckInInstructions = builder.specialCheckInInstructions;
    this.knowBeforeYouGo = builder.knowBeforeYouGo;
    this.optionalFees = builder.optionalFees;
    this.mandatoryFees = builder.mandatoryFees;
    this.kaligoServiceFee = builder.kaligoServiceFee;
    this.hotelFees = builder.hotelFees;
    this.surcharges = builder.surcharges;
  }

  getBreakfastInfo() {
    return this.breakfastInfo;
  }

  getSpecialCheckInInstructions() {
    return this.specialCheckInInstructions;
  }

  getKnowBeforeYouGo() {
    return this.knowBeforeYouGo;
  }

  getOptionalFees() {
    return this.optionalFees;
  }

  getMandatoryFees() {
    return this.mandatoryFees;
  }

  getKaligoServiceFee() {
    return this.kaligoServiceFee;
  }

  getHotelFees() {
    return this.hotelFees;
  }

  getSurcharges() {
    return this.surcharges;
  }

  static get Builder() {
    return class {
      constructor() {
        this.breakfastInfo = null;
        this.specialCheckInInstructions = null;
        this.knowBeforeYouGo = null;
        this.optionalFees = null;
        this.mandatoryFees = null;
        this.kaligoServiceFee = null;
        this.hotelFees = null;
        this.surcharges = null;
      }

      setBreakfastInfo(breakfastInfo) {
        if (breakfastInfo === null) {
          return this;
        }
        if (!isValidBreakfastInfo(breakfastInfo)) {
          throw new Error("Invalid breakfast info");
        }
        this.breakfastInfo = breakfastInfo;
        return this;
      }

      setSpecialCheckInInstructions(specialCheckInInstructions) {
        if (specialCheckInInstructions === null) {
          return this;
        }
        this.specialCheckInInstructions = specialCheckInInstructions;
        return this;
      }

      setKnowBeforeYouGo(knowBeforeYouGo) {
        if (knowBeforeYouGo === null) {
          return this;
        }
        this.knowBeforeYouGo = knowBeforeYouGo;
        return this;
      }

      setOptionalFees(optionalFees) {
        if (optionalFees === null) {
          return this;
        }
        this.optionalFees = String(optionalFees);
        return this;
      }

      setMandatoryFees(mandatoryFees) {
        if (mandatoryFees === null) {
          return this;
        }
        this.mandatoryFees = String(mandatoryFees);
        return this;
      }

      setKaligoServiceFee(kaligoServiceFee) {
        this.kaligoServiceFee = kaligoServiceFee;
        return this;
      }

      setHotelFees(hotelFees) {
        if (!isValidArray(hotelFees)) {
          throw new Error("Hotel fees must be an array");
        }
        this.hotelFees = hotelFees;
        return this;
      }

      setSurcharges(surcharges) {
        if (surcharges == null) {
          return this;
        }

        if (surcharges.length === 0) {
          return this;
        }

        if (!isValidArray(surcharges)) {
          throw new Error("Surcharges must be an array");
        }
        let surchargeObject = null;

        for (let i = 0; i < surcharges.length; i++) {
          surchargeObject = surcharges[i];
          if (Number(surchargeObject.amount) < 0) {
            throw Error("Surcharge amount must be positive");
          }
        }

        this.surcharges = surcharges;
        return this;
      }

      build() {
        return new RoomAdditionalInfo(this);
      }
    };
  }
}

class PriceDetails {
  constructor(builder) {
    this.description = builder.description;
    this.priceType = builder.priceType;
    this.maxCashPayment = builder.maxCashPayment;
    this.covertedMaxCashPayment = builder.covertedMaxCashPayment;
    this.points = builder.points;
    this.bonuses = builder.bonuses;
    this.bonusPrograms = builder.bonusPrograms;
    this.bonusTiers = builder.bonusTiers;
    this.lowestPrice = builder.lowestPrice;
    this.price = builder.price;
    this.convertedPrice = builder.convertedPrice;
    this.lowestConvertedPrice = builder.lowestConvertedPrice;
    this.chargeableRate = builder.chargeableRate;
    this.marketRates = builder.marketRates;
  }

  getDescription() {
    return this.description;
  }

  getPriceType() {
    return this.priceType;
  }

  getMaxCashPayment() {
    return this.maxCashPayment;
  }

  getCovertedMaxCashPayment() {
    return this.covertedMaxCashPayment;
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

  getChargeableRate() {
    return this.chargeableRate;
  }

  getMarketRates() {
    return this.marketRates;
  }

  static get Builder() {
    return class {
      constructor() {
        this.description = null;
        this.priceType = null;
        this.maxCashPayment = null;
        this.covertedMaxCashPayment = null;
        this.points = null;
        this.bonuses = null;
        this.bonusPrograms = null;
        this.bonusTiers = null;
        this.lowestPrice = null;
        this.price = null;
        this.convertedPrice = null;
        this.lowestConvertedPrice = null;
        this.chargeableRate = null;
        this.marketRates = null;
      }

      setPriceType(priceType) {
        if (!isNonEmptyString(priceType) || priceType !== "single") {
          throw new Error("Price type must be one of the valid types");
        }
        this.priceType = priceType;
        return this;
      }

      setDescription(description) {
        if (!isNonEmptyString(description)) {
          throw new Error("Description must be a non-empty string");
        }
        this.description = description;
        return this;
      }

      setMaxCashPayment(maxCashPayment) {
        if (!isValidNumber(maxCashPayment)) {
          throw new Error("Max cash payment must be a positive number");
        }
        if (Number(maxCashPayment) <= 0) {
          throw new Error("must be a positive number");
        }
        this.maxCashPayment = String(maxCashPayment);
        return this;
      }

      setCovertedMaxCashPayment(covertedMaxCashPayment) {
        if (!isValidNumber(covertedMaxCashPayment)) {
          throw new Error(
            "Converted max cash payment must be a positive number"
          );
        }
        this.covertedMaxCashPayment = covertedMaxCashPayment;
        return this;
      }

      setPoints(points) {
        if (points == null) {
          return this;
        }
        if (!isValidNumber(points)) {
          throw new Error("Points must be a positive integer");
        }

        if (Number(points) < 0) {
          throw new Error("Points must be a positive integer");
        }
        this.points = String(points);
        return this;
      }

      setBonuses(bonuses) {
        if (bonuses == null) {
          return this;
        }
        if (!isValidNumber(bonuses, true)) {
          throw new Error("Bonuses must be a non-negative number");
        }
        this.bonuses = bonuses;
        return this;
      }

      setBonusTiers(bonusTiers) {
        if (bonusTiers == null) {
          return this;
        }
        if (!isValidArray(bonusTiers)) {
          throw new Error("Bonus tiers must be an array");
        }
        this.bonusTiers = bonusTiers;
        return this;
      }

      setBonusPrograms(bonusPrograms) {
        if (bonusPrograms == null) {
          return this;
        }
        if (!isValidArray(bonusPrograms)) {
          throw new Error("Bonus programs must be an array");
        }
        this.bonusPrograms = bonusPrograms;
        return this;
      }

      setLowestPrice(lowestPrice) {
        if (!isValidNumber(lowestPrice)) {
          throw new Error("Lowest price must be a positive number");
        }
        if (Number(lowestPrice) <= 0) {
          throw new Error("must be a positive number");
        }
        this.lowestPrice = String(lowestPrice);
        return this;
      }

      setPrice(price) {
        if (!isValidNumber(price)) {
          throw new Error("Price must be a positive number");
        }
        if (Number(price) <= 0) {
          throw new Error("must be a positive number");
        }
        this.price = String(price);
        return this;
      }

      setConvertedPrice(convertedPrice) {
        if (!isValidNumber(convertedPrice)) {
          throw new Error("Converted price must be a positive number");
        }
        if (Number(convertedPrice) <= 0) {
          throw new Error("must be a positive number");
        }
        this.convertedPrice = String(convertedPrice);
        return this;
      }

      setLowestConvertedPrice(lowestConvertedPrice) {
        if (!isValidNumber(lowestConvertedPrice)) {
          throw new Error("Base rate must be a positive number");
        }
        if (Number(lowestConvertedPrice) <= 0) {
          throw new Error("must be a positive number");
        }
        this.lowestConvertedPrice = String(lowestConvertedPrice);
        return this;
      }

      setChargeableRate(chargeableRate) {
        if (!isValidNumber(chargeableRate)) {
          throw new Error("Base rate must be a positive number");
        }
        if (Number(chargeableRate) <= 0) {
          throw new Error("must be a positive number");
        }
        this.chargeableRate = String(chargeableRate);
        return this;
      }

      setMarketRates(marketRates) {
        if (
          marketRates === null ||
          marketRates === undefined ||
          marketRates === "" ||
          marketRates == []
        ) {
          return this;
        }

        if (!isValidArray(marketRates)) {
          throw Error("Market rates must be an array");
        }

        for (let i = 0; i < marketRates.length; i++) {
          let marketRatesObj = marketRates[i];
          if (
            !Object.keys(marketRatesObj).includes("supplier") ||
            !Object.keys(marketRatesObj).includes("rate")
          ) {
            throw new Error(
              "Market rates must be an array of valid rate objects"
            );
          }
          if (Number(marketRatesObj.rate) < 0) {
            throw new Error("must be a non-negative number");
          }
        }

        // Validate that all rate values are non-negative numbers
        const hasValidRates = marketRates.map((object) =>
          Object.values(object).every((rate) => isValidPrice(rate))
        );
        if (!hasValidRates) {
          throw new Error(
            "Market rates must be an array of valid rate objects"
          );
        }
        this.marketRates = marketRates;
        return this;
      }

      build() {
        return new PriceDetails(this);
      }
    };
  }
}

class TaxDetails {
  constructor(builder) {
    this.baseRate = builder.baseRate;
    this.baseRateInCurrency = builder.baseRateInCurrency;
    this.includedTaxesFeesTotal = builder.includedTaxesFeesTotal;
    this.includedTaxesFeesTotalInCurrency =
      builder.includedTaxesFeesTotalInCurrency;
    this.excludedTaxesFeesTotal = builder.excludedTaxesFeesTotal;
    this.excludedTaxesFeesTotalInCurrency =
      builder.excludedTaxesFeesTotalInCurrency;
    this.includedTaxesFeesDetails = builder.includedTaxesFeesDetails;
    this.includedTaxesFeesInCurrencyDetails =
      builder.includedTaxesFeesInCurrencyDetails;
    this.excludedTaxesFeesInCurrencyDetails =
      builder.excludedTaxesFeesInCurrencyDetails;
    this.excludedTaxesFeesDetails = builder.excludedTaxesFeesDetails;
  }

  getBaseRate() {
    return this.baseRate;
  }
  getBaseRateInCurrency() {
    return this.baseRateInCurrency;
  }
  getIncludedTaxesFeesTotal() {
    return this.includedTaxesFeesTotal;
  }
  getIncludedTaxesFeesTotalInCurrency() {
    return this.includedTaxesFeesTotalInCurrency;
  }
  getExcludedTaxesFeesTotal() {
    return this.excludedTaxesFeesTotal;
  }
  getExcludedTaxesFeesTotalInCurrency() {
    return this.excludedTaxesFeesTotalInCurrency;
  }
  getIncludedTaxesFeesDetails() {
    return this.includedTaxesFeesDetails;
  }
  getIncludedTaxesFeesInCurrencyDetails() {
    return this.includedTaxesFeesInCurrencyDetails;
  }
  getExcludedTaxesFeesInCurrencyDetails() {
    return this.excludedTaxesFeesInCurrencyDetails;
  }
  getExcludedTaxesFeesDetails() {
    return this.excludedTaxesFeesDetails;
  }

  static get Builder() {
    return class {
      constructor() {
        this.baseRate = null;
        this.baseRateInCurrency = null;
        this.includedTaxesFeesTotal = null;
        this.includedTaxesFeesTotalInCurrency = null;
        this.excludedTaxesFeesTotal = null;
        this.excludedTaxesFeesTotalInCurrency = null;
        this.includedTaxesFeesDetails = null;
        this.includedTaxesFeesInCurrencyDetails = null;
        this.excludedTaxesFeesInCurrencyDetails = null;
        this.excludedTaxesFeesDetails = null;
      }

      setBaseRate(baseRate) {
        if (!isValidNumber(baseRate)) {
          throw new Error("Base rate must be a positive number");
        }
        if (Number(baseRate) <= 0) {
          throw new Error("must be a positive number");
        }
        this.baseRate = String(baseRate);
        return this;
      }

      setBaseRateInCurrency(baseRateInCurrency) {
        if (!isValidNumber(baseRateInCurrency)) {
          throw new Error("Base rate in currency must be a positive number");
        }
        if (Number(baseRateInCurrency) <= 0) {
          throw new Error("must be a positive number");
        }
        this.baseRateInCurrency = String(baseRateInCurrency);
        return this;
      }

      setIncludedTaxesFeesTotal(includedTaxesFeesTotal) {
        if (!isValidNumber(includedTaxesFeesTotal)) {
          throw new Error(
            "Included taxes fees total must be a non-negative number"
          );
        }
        if (Number(includedTaxesFeesTotal) < 0) {
          throw new Error(
            "Included taxes fees total must be a non-negative number"
          );
        }
        this.includedTaxesFeesTotal = String(includedTaxesFeesTotal);
        return this;
      }

      setIncludedTaxesFeesTotalInCurrency(includedTaxesFeesTotalInCurrency) {
        if (!isValidNumber(includedTaxesFeesTotalInCurrency)) {
          throw new Error(
            "Included taxes fees total in currency must be a non-negative number"
          );
        }

        if (Number(includedTaxesFeesTotalInCurrency) < 0) {
          throw new Error(
            "Included taxes fees total in currency must be a non-negative number"
          );
        }
        this.includedTaxesFeesTotalInCurrency = String(
          includedTaxesFeesTotalInCurrency
        );
        return this;
      }
      setExcludedTaxesFeesTotal(excludedTaxesFeesTotal) {
        if (!isValidNumber(excludedTaxesFeesTotal, true)) {
          throw new Error(
            "Excluded taxes fees total must be a non-negative number"
          );
        }
        this.excludedTaxesFeesTotal = String(excludedTaxesFeesTotal);
        return this;
      }
      setExcludedTaxesFeesTotalInCurrency(excludedTaxesFeesTotalInCurrency) {
        if (!isValidNumber(excludedTaxesFeesTotalInCurrency, true)) {
          throw new Error(
            "Excluded taxes fees total in currency must be a non-negative number"
          );
        }
        this.excludedTaxesFeesTotalInCurrency =
          excludedTaxesFeesTotalInCurrency;
        return this;
      }
      setIncludedTaxesFeesDetails(includedTaxesFeesDetails) {
        if (
          includedTaxesFeesDetails &&
          !isValidArray(includedTaxesFeesDetails)
        ) {
          throw new Error("Included taxes fees details must be an array");
        }
        let taxObject = null;

        for (let i = 0; i < includedTaxesFeesDetails.length; i++) {
          taxObject = includedTaxesFeesDetails[i];
          if (
            !Object.keys(taxObject).includes("id") ||
            !Object.keys(taxObject).includes("currency") ||
            !Object.keys(taxObject).includes("amount")
          ) {
            throw new Error("Tax fee details must have valid structure");
          }
          if (Number(taxObject.amount) < 0) {
            throw new Error("must be a non-negative number");
          }
        }

        // "Tax fee details must have valid structure");
        this.includedTaxesFeesDetails = includedTaxesFeesDetails;
        return this;
      }
      setIncludedTaxesFeesInCurrencyDetails(
        includedTaxesFeesInCurrencyDetails
      ) {
        if (
          includedTaxesFeesInCurrencyDetails &&
          !isValidArray(includedTaxesFeesInCurrencyDetails)
        ) {
          throw new Error(
            "Included taxes fees in currency details must be an array"
          );
        }
        this.includedTaxesFeesInCurrencyDetails =
          includedTaxesFeesInCurrencyDetails;
        return this;
      }
      setExcludedTaxesFeesInCurrencyDetails(
        excludedTaxesFeesInCurrencyDetails
      ) {
        if (
          excludedTaxesFeesInCurrencyDetails &&
          !isValidArray(excludedTaxesFeesInCurrencyDetails)
        ) {
          throw new Error(
            "Excluded taxes fees in currency details must be an array"
          );
        }
        this.excludedTaxesFeesInCurrencyDetails =
          excludedTaxesFeesInCurrencyDetails;
        return this;
      }
      setExcludedTaxesFeesDetails(excludedTaxesFeesDetails) {
        if (
          excludedTaxesFeesDetails &&
          !isValidArray(excludedTaxesFeesDetails)
        ) {
          throw new Error("Excluded taxes fees details must be an array");
        }
        this.excludedTaxesFeesDetails = excludedTaxesFeesDetails;
        return this;
      }

      build() {
        return new TaxDetails(this);
      }
    };
  }
}

module.exports = {
  KeyRoomDetails,
  RoomAdditionalInfo,
  PriceDetails,
  TaxDetails,
  HotelRoomData,
};
