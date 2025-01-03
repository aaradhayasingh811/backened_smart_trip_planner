import mongoose from "mongoose"

const tripSchema = new mongoose.Schema({
    user :{
        // type :mongoose.Schema.Types.ObjectId,
        // ref :'User'
        type:String,
        required :true
    },
    destination: {
        type: String,
        required: true,
    },
    budget: {
        type: Number,
        required: true,
      },
      imageSrc: {
        type: String,
        required: true,
      },
      days:{
        type:Number,
        required:true,
      },
      numberOfPeople:{
        type:Number,
        required:true,
      },
      hotels: [
        {
          id: {
            type: String,
            required: true,
            // unique: true,
          },
          
          cost: {
            type: Number,
            required: true,
          },
          address: {
            type: String,
            required: true,
          },
          imageUrl: {
            type: String,
            required: true,
          },
          rating: {
            type: Number,
            required: true,
            min:0,
            max:5,
           
          },
        },
      ],
      schedule: {
        type: Map,
        of: {
          morning: {
            placeName: {
              type: String,
              required: true,
            },
            placeImageUrl: {
              type: String,
              // required: true,
            },
            time: {
              type: String,
              required: true,
            },
            googleMapUrl: {
              type: String,
              // required: true,
            },
            description: {
              type: String,
              required: true,
            },
          },
          afternoon: {
            placeName: {
              type: String,
              required: true,
            },
            placeImageUrl: {
              type: String,
              required: true,
            },
            time: {
              type: String,
              required: true,
            },
            googleMapUrl: {
              type: String,
              required: true,
            },
            description: {
              type: String,
              required: true,
            },
          },
        },
        required: true,
      },
})


// tripSchema.pre('save', function(next) {
//   const schedule = this.schedule;
//   for (const key of schedule.keys()) {
//     if (key.includes('.') || key.includes(',')) {
//       throw new Error(`Invalid key found: ${key}. Keys cannot contain '.' or ','.`);
//     }
//   }
//   next();
// });

export const Trip = mongoose.model('Trip', tripSchema);
