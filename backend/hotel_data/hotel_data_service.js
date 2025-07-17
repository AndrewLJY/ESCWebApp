var hotelDataDTO = require('../hotel_data/hotel_data_DTO');
const express = require('express')

class HotelDataTransferService{

    constructor(jsonData){
        this.keyDetails = null;
        this.iTrustYouBenchmark = null;
        this.imageDetails = null;
        this.pricingRankingData = null;
        this.amenities = null;
        this.originalMetaData = null;
        this.jsonData = jsonData;
    }

    transferKeyDetails(){
        this.keyDetails = new hotelDataDTO.KeyDetails
        .Builder()
        .setId(this.jsonData.id)
        .setImageCount(this.jsonData.imageCount)
        .setLatitude(this.jsonData.latitude)
        .setLongitude(this.jsonData.longitude)
        .setName(this.jsonData.name)
        .setAddress(this.jsonData.address)
        .setAddress1(this.jsonData.address1)
        .setRating(this.jsonData.rating)
        .setDistance(this.jsonData.distance)
        .setCheckinTime(this.jsonData.checkin_time)
        .setDescription(this.jsonData.description)
        .build();

        return this;
    }

    transferITrustYouScore(){
        this.iTrustYouBenchmark = new hotelDataDTO.TrustYouBenchmark.Builder()
        .setTrustYouId(this.jsonData.trustyou.id)
        .setTrustYouScoreParameters(this.jsonData.trustyou)
        .build();

        return this;

    }

    transferImageDetails(){
        console.log(`${this.jsonData} here`);
        console.log(this.jsonData.image_details);
        this.imageDetails = new hotelDataDTO.ImageDetails.Builder()
        .setImageCounts(this.jsonData.image_details.count)
        .setImageUrlPrefix(this.jsonData.image_details.prefix)
        .setImageUrlSuffix(this.jsonData.image_details.suffix)
        .stitchImageUrls()
        .build();

        return this;
    }

    transferPricingRankingData(){
        this.pricingRankingData = new hotelDataDTO.PricingRankingData.Builder()
        .setRank(this.jsonData.rank)
        .setSearchRank(this.jsonData.searchRank)
        .setPriceType(this.jsonData.price_type)
        .setFreeCancellation(this.jsonData.free_cancellation)
        .setRoomsAvailable(this.jsonData.rooms_available)
        .setMaxCashPayment(this.jsonData.max_cash_payment)
        .setPoints(this.jsonData.points)
        .setBonuses(this.jsonData.bonuses)
        .setBonusTiers(this.jsonData.bonus_tiers)
        .setLowestPrice(this.jsonData.lowest_price)
        .setPrice(this.jsonData.price)
        .setConvertedPrice(this.jsonData.converted_price)
        .setLowestConvertedPrice(this.jsonData.lowest_converted_price)
        .setMarketRateSupplier(this.jsonData.market_rates.supplier)
        .setMarketRateRates(this.jsonData.market_rates.rate)
        .build();

        return this;
    }

    transferAmenitiesData(){
        this.amenities = new hotelDataDTO.Amenities.Builder()
        .setAmenities(this.jsonData.amenities)
        .build();

        return this;
    }

    transferOriginalMetaData(){
        this.originalMetaData = new hotelDataDTO.OriginalMetaData.Builder()
        .setName(this.jsonData.name)
        .setCity(this.jsonData.city)
        .setState(this.jsonData.state)
        .setCountry(this.jsonData.country)
        .build();

        return this;
    }

    getNewHotelDataDTOClass(){
        return new hotelDataDTO.HotelData(this.keyDetails, this.amenities, this.imageDetails, this.originalMetaData, this.pricingRankingData, this.iTrustYouBenchmark)
    }
}

module.exports = {HotelDataTransferService};