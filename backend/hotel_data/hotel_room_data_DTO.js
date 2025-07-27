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
  }

  getKeyId() {
    return this.keyId;
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
      }

      setKeyId(keyId) {
        this.keyId = keyId;
        return this;
      }

      setRoomDescription(roomDescription) {
        this.roomDescription = roomDescription;
        return this;
      }

      setRoomNormalisedDescription(roomNormalisedDescription) {
        this.roomNormalisedDescription = roomNormalisedDescription;
        return this;
      }

      setRoomTypeIndex(roomTypeIndex) {
        this.roomTypeIndex = roomTypeIndex;
        return this;
      }

      setFreeCancellation(freeCancellation) {
        this.freeCancellation = freeCancellation;
        return this;
      }

      setLongDescription(longDescription) {
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
        this.breakfastInfo = breakfastInfo;
        return this;
      }

      setSpecialCheckInInstructions(specialCheckInInstructions) {
        this.specialCheckInInstructions = specialCheckInInstructions;
        return this;
      }

      setKnowBeforeYouGo(knowBeforeYouGo) {
        this.knowBeforeYouGo = knowBeforeYouGo;
        return this;
      }

      setOptionalFees(optionalFees) {
        this.optionalFees = optionalFees;
        return this;
      }

      setMandatoryFees(mandatoryFees) {
        this.mandatoryFees = mandatoryFees;
        return this;
      }

      setKaligoServiceFee(kaligoServiceFee) {
        this.kaligoServiceFee = kaligoServiceFee;
        return this;
      }

      setHotelFees(hotelFees) {
        this.hotelFees = hotelFees;
        return this;
      }

      setSurcharges(surcharges) {
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
        this.priceType = priceType;
        return this;
      }

      setDescription(description) {
        this.description = description;
        return this;
      }

      setMaxCashPayment(maxCashPayment) {
        this.maxCashPayment = maxCashPayment;
        return this;
      }

      setCovertedMaxCashPayment(covertedMaxCashPayment) {
        this.covertedMaxCashPayment = covertedMaxCashPayment;
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

      setBonusPrograms(bonusPrograms) {
        this.bonusPrograms = bonusPrograms;
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

      setChargeableRate(chargeableRate) {
        this.chargeableRate = chargeableRate;
        return this;
      }

      setMarketRates(marketRates) {
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
        this.baseRate = baseRate;
        return this;
      }
      setBaseRateInCurrency(baseRateInCurrency) {
        this.baseRateInCurrency = baseRateInCurrency;
        return this;
      }
      setIncludedTaxesFeesTotal(includedTaxesFeesTotal) {
        this.includedTaxesFeesTotal = includedTaxesFeesTotal;
        return this;
      }
      setIncludedTaxesFeesTotalInCurrency(includedTaxesFeesTotalInCurrency) {
        this.includedTaxesFeesTotalInCurrency =
          includedTaxesFeesTotalInCurrency;
        return this;
      }
      setExcludedTaxesFeesTotal(excludedTaxesFeesTotal) {
        this.excludedTaxesFeesTotal = excludedTaxesFeesTotal;
        return this;
      }
      setExcludedTaxesFeesTotalInCurrency(excludedTaxesFeesTotalInCurrency) {
        this.excludedTaxesFeesTotalInCurrency =
          excludedTaxesFeesTotalInCurrency;
        return this;
      }
      setIncludedTaxesFeesDetails(includedTaxesFeesDetails) {
        this.includedTaxesFeesDetails = includedTaxesFeesDetails;
        return this;
      }
      setIncludedTaxesFeesInCurrencyDetails(
        includedTaxesFeesInCurrencyDetails
      ) {
        this.includedTaxesFeesInCurrencyDetails =
          includedTaxesFeesInCurrencyDetails;
        return this;
      }
      setExcludedTaxesFeesInCurrencyDetails(
        excludedTaxesFeesInCurrencyDetails
      ) {
        this.excludedTaxesFeesInCurrencyDetails =
          excludedTaxesFeesInCurrencyDetails;
        return this;
      }
      setExcludedTaxesFeesDetails(excludedTaxesFeesDetails) {
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
