const Joi = require('joi');

const bookingSchema = Joi.object({
  id: Joi.string().pattern(/^[a-zA-Z0-9\s\-]+$/).min(1).max(255).required(),
  hotel_id: Joi.string().pattern(/^[a-zA-Z0-9\s\-]+$/).min(1).max(255).required(),
  destination_id: Joi.string().pattern(/^[a-zA-Z0-9\s\-]+$/).min(1).max(255).required(),
  no_of_nights: Joi.number().integer().min(1).max(365).required(),

  start_date: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).required()
    .messages({ 'string.pattern.base': 'start_date must be in YYYY-MM-DD format' }),

  end_date: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).required()
    .messages({ 'string.pattern.base': 'end_date must be in YYYY-MM-DD format' }),

  guest_count: Joi.number().integer().min(1).max(20).required(),
  message_to_hotel: Joi.string().max(1000).allow('', null),
  room_type: Joi.string().pattern(/^[a-zA-Z0-9\s\-]+$/).min(1).max(255).required().required(),
  total_price: Joi.number().integer().min(0).required(),
  user_id: Joi.number().integer().positive().required(),
  full_name: Joi.string().min(1).max(255).pattern(/^[a-zA-Z\s\-']+$/).required(),
  payment_id: Joi.string().pattern(/^[a-zA-Z0-9\s\-]+$/).min(5).max(255).required()
}).custom((obj,helpers)=>{
    //obj is the body,err is helper methods reporting validation failure
    const start = new Date(obj.start_date);
    const end = new Date(obj.end_date);
    if (end<start){
        console.log(any.custom);
        return helpers.error('any.required',{message:'end date must be later than start date'});
    }
    return obj;
    }).messages({
        'any.custom':'{{#messages}}'
    });

module.exports = bookingSchema;
