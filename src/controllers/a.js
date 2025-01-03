import { User } from "../models/user.model.js";
import { Trip } from "../models/trip.model.js";

import { GoogleGenerativeAI } from "@google/generative-ai";
const createTripController = async (req, res) => {
  const { destination, days, budget, numberOfPeople } = req.body;
  let prompt = `Plan a ${days}-day budget-friendly ${numberOfPeople} person trip to ${destination} with a total budget of Rs${budget}.Provide the details in the following JSON format:
    Include an imageSrc key with a valid image URL representing the destination.
    Provide 3 hotel recommendations in an array. Each hotel object should have the following properties:
    id: A unique identifier for the hotel.
    cost: The per-night cost of the hotel.
    address: The hotel's address.
    imageUrl: A valid URL to an image of the hotel.
    rating: The hotel's rating (out of 5).
    Create a schedule for 5 days in an object where each day has two parts: morning and afternoon. Each part should have the following details:
    placeName: Name of the attraction or destination.
    placeimageUrl: A valid URL to an image of the place.
    time: The recommended time slot for the visit.
    googlemapUrl: A valid Google Maps URL for the location.
    description: A two-line description of the place.
    Ensure all URLs (image and map links) are valid and work. Adhere to the specified budget while recommending hotels and attractions. Present the data accurately in the JSON format`;

  const apiKey = process.env.GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey);

  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash-exp",
  });

  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "application/json",
  };

  async function run() {
    const chatSession = model.startChat({
      generationConfig,
      history: [
        {
          role: "user",
          parts: [
            {
              text: "Plan a 5-day budget-friendly solo trip to Allahabad (Prayagraj) with a total budget of ₹5000. Provide the details in the following JSON format:\n\nInclude an imageSrc key with a valid image URL representing the destination.\n\nProvide 3 hotel recommendations in an array. Each hotel object should have the following properties:\n\nid: A unique identifier for the hotel.\ncost: The per-night cost of the hotel.\naddress: The hotel's address.\nimageUrl: A valid URL to an image of the hotel.\nrating: The hotel's rating (out of 5).\nCreate a schedule for 5 days in an object where each day has two parts: morning and afternoon. Each part should have the following details:\n\nplaceName: Name of the attraction or destination.\nplaceimageUrl: A valid URL to an image of the place.\ntime: The recommended time slot for the visit.\ngooglemapUrl: A valid Google Maps URL for the location.\ndescription: A two-line description of the place.\nEnsure all URLs (image and map links) are valid and work. Adhere to the specified budget while recommending hotels and attractions. Present the data accurately in the JSON format\n",
            },
          ],
        },
        {
          role: "model",
          parts: [
            {
              text: '```json\n{\n  "destination": "Prayagraj (Allahabad)",\n  "imageSrc": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Triveni_Sangam_%28Allahabad%29.jpg/1280px-Triveni_Sangam_%28Allahabad%29.jpg",\n  "totalBudget": 5000,\n  "hotelRecommendations": [\n    {\n      "id": 1,\n      "cost": 800,\n      "address": "Near Civil Lines, Prayagraj",\n       "imageUrl": "https://lh3.googleusercontent.com/p/AF1QipPQ47YfC8QZkO27Vz8u9j_q0KqV_Iu0b_7d_hLg=w592-h404-n-k-no-v1",\n      "rating": 3.8\n    },\n     {\n      "id": 2,\n      "cost": 900,\n      "address": "Near Railway Station, Prayagraj",\n       "imageUrl": "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0f/43/5b/4c/hotel-raj-deluxe.jpg?w=700&h=-1&s=1",\n      "rating": 4.0\n    },\n    {\n      "id": 3,\n      "cost": 700,\n      "address": "Near Katra, Prayagraj",\n       "imageUrl":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4r3s48j5xQv_7g9f29b9o1G07n3R6n0y76J7Z-yKzT03lDqN",\n      "rating": 3.5\n    }\n  ],\n  "schedule": {\n    "day1": {\n      "morning": {\n        "placeName": "Triveni Sangam",\n        "placeimageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Triveni_Sangam_%28Allahabad%29.jpg/1280px-Triveni_Sangam_%28Allahabad%29.jpg",\n        "time": "7:00 AM - 10:00 AM",\n        "googlemapUrl": "https://www.google.com/maps/place/Triveni+Sangam/@25.4358314,81.8940434,15z/data=!4m6!3m5!1s0x3985339396803545:0xdf5a06e1152a5991!8m2!3d25.4358314!4d81.8940434!16zL20vMDJsMWRn",\n        "description": "The confluence of the Ganga, Yamuna, and mythical Saraswati rivers. A sacred place for Hindus, offering boat rides and spiritual experiences."\n      },\n      "afternoon": {\n        "placeName": "Allahabad Fort",\n        "placeimageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Allahabad_Fort_Gate_View.JPG/1280px-Allahabad_Fort_Gate_View.JPG",\n        "time": "1:00 PM - 4:00 PM",\n        "googlemapUrl": "https://www.google.com/maps/place/Allahabad+Fort/@25.4393007,81.8355203,17z/data=!3m1!4b1!4m6!3m5!1s0x39853368240230d3:0x7d087b31d734f88b!8m2!3d25.4393007!4d81.8380952!16zL20vMDV3ZzFq",\n        "description": "A historic fort built by Emperor Akbar. It houses various structures and offers views of the Sangam."\n      }\n    },\n    "day2": {\n      "morning": {\n        "placeName": "Anand Bhawan",\n         "placeimageUrl":"https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Anand_Bhawan_2.JPG/1280px-Anand_Bhawan_2.JPG",\n        "time": "9:00 AM - 12:00 PM",\n         "googlemapUrl":"https://www.google.com/maps/place/Anand+Bhawan/@25.4426129,81.8440969,17z/data=!3m1!4b1!4m6!3m5!1s0x3985335a4647d02b:0x52d910701c532805!8m2!3d25.4426129!4d81.8466718!16zL20vMDFtZ2p3cg",\n        "description": "The former residence of the Nehru family. Now a museum displaying their lives and Indian history."\n      },\n      "afternoon": {\n        "placeName": "Khusro Bagh",\n        "placeimageUrl":"https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Khusro_Bagh_Gate.JPG/1280px-Khusro_Bagh_Gate.JPG",\n        "time": "2:00 PM - 5:00 PM",\n         "googlemapUrl":"https://www.google.com/maps/place/Khusro+Bagh/@25.4635875,81.8572553,17z/data=!3m1!4b1!4m6!3m5!1s0x398532c2f467d051:0x51b35825816134e4!8m2!3d25.4635875!4d81.8598302!16zL20vMDJsMGFh",\n        "description": "A historical garden complex with tombs of Mughal royalty, known for its intricate architecture."\n      }\n    },\n    "day3": {\n      "morning": {\n        "placeName": "All Saints Cathedral",\n        "placeimageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/All_Saints_Cathedral_Allahabad_2.jpg/1280px-All_Saints_Cathedral_Allahabad_2.jpg",\n        "time": "9:00 AM - 11:00 AM",\n         "googlemapUrl":"https://www.google.com/maps/place/All+Saints+Cathedral/@25.4452847,81.8473633,17z/data=!3m1!4b1!4m6!3m5!1s0x3985335654429589:0x44050d3310e05758!8m2!3d25.4452847!4d81.8499382!16zL20vMDJzM3l0",\n        "description": "A grand cathedral showcasing Gothic architecture. It\'s a peaceful place to visit."\n      },\n       "afternoon": {\n        "placeName": "Patalpuri Temple",\n         "placeimageUrl":"https://www.theindianpanorama.news/wp-content/uploads/2019/01/Patalpuri-Temple-520x335.jpg",\n        "time": "2:00 PM - 4:00 PM",\n         "googlemapUrl":"https://www.google.com/maps/place/Patalpuri+Temple/@25.4328271,81.8883334,17z/data=!3m1!4b1!4m6!3m5!1s0x398533e0f6604f01:0x60c4104f83871c14!8m2!3d25.4328271!4d81.8909083!16s%2Fg%2F11c1twrp0d",\n        "description": "An ancient underground temple with religious significance near the Allahabad Fort."\n      }\n    },\n    "day4": {\n     "morning": {\n        "placeName": "Saraswati Ghat",\n        "placeimageUrl": "https://www.holidaydekho.com/uploaded_files/place_images/original/Saraswati-Ghat_Prayagraj_20190116134428.jpg",\n        "time": "8:00 AM - 10:00 AM",\n        "googlemapUrl": "https://www.google.com/maps/place/Saraswati+Ghat/@25.4368176,81.8960939,17z/data=!3m1!4b1!4m6!3m5!1s0x398533870b0a0399:0xfd41f322794e7c7a!8m2!3d25.4368176!4d81.8986688!16s%2Fg%2F11ghb6y3j5",\n        "description": "One of the ghats along the Sangam area. You can witness rituals performed by the locals."\n      },\n      "afternoon": {\n        "placeName": "Mankameshwar Temple",\n         "placeimageUrl": "https://upload.wikimedia.org/wikipedia/commons/9/9d/Mankameshwar_Temple.jpg",\n        "time": "1:00 PM - 3:00 PM",\n        "googlemapUrl": "https://www.google.com/maps/place/Mankameshwar+Temple/@25.4585142,81.8213878,17z/data=!3m1!4b1!4m6!3m5!1s0x398532bb6f48686d:0x3e3f940719560276!8m2!3d25.4585142!4d81.8239627!16s%2Fg%2F11bw35n147",\n        "description":"A revered Hindu temple dedicated to Lord Shiva. A place of spiritual solace."\n      }\n    },\n    "day5": {\n      "morning": {\n        "placeName": "Company Garden",\n          "placeimageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Company_Garden_Allahabad.jpg/1280px-Company_Garden_Allahabad.jpg",\n        "time": "9:00 AM - 11:00 AM",\n        "googlemapUrl":"https://www.google.com/maps/place/Company+Garden/@25.4535491,81.8535545,17z/data=!3m1!4b1!4m6!3m5!1s0x398532bf65358559:0xbab825cb58563220!8m2!3d25.4535491!4d81.8561294!16s%2Fg%2F11bc0r6451",\n        "description": "A serene garden to relax and unwind, featuring statues and greenery."\n      },\n      "afternoon": {\n        "placeName": "Departure from Prayagraj",\n         "placeimageUrl": "https://www.tourmyindia.com/blog/wp-content/uploads/2020/05/Prayagraj-Railway-Station.jpg",\n        "time": "12:00 PM onwards",\n         "googlemapUrl": "https://www.google.com/maps/place/Prayagraj+Junction/@25.4546471,81.8205726,17z/data=!3m1!4b1!4m6!3m5!1s0x398532ae768a60c7:0x95e5865e95303f1f!8m2!3d25.4546471!4d81.8231475!16s%2Fg%2F11v79q3s7s",\n         "description": "Head to the railway station or bus stand for your journey back home."\n      }\n    }\n  }\n}\n```\n',
            },
          ],
        },
      ],
    });

    const result = await chatSession.sendMessage(prompt);
    const Data = result.response.text();
    const data = JSON.parse(Data);

    const destination = data.destination;
    const budget = data.totalBudget;
    const imageSrc = data.imageSrc;
    // console.log(data.destination);
    // console.log(data.totalBudget);
    // console.log(data.imageSrc);
    let hotels = [];
    data.hotelRecommendations.forEach((hotel) => {
      hotels.push({
        id: hotel.id,
        cost: hotel.cost,
        address: hotel.address,
        imageUrl: hotel.imageUrl,
        rating: hotel.rating,
      });
      console.log(`Hotel ID: ${hotel.id}, Address: ${hotel.address}, Cost: ${hotel.cost}, Rating: ${hotel.rating}, Imageurl : ${hotel.imageUrl}`);
    });


    // to append
    // const schedule = new Map();

    // // Function to add or update data for specific days in the Map
    // const addScheduleToMap = async(
    //   day,
    //   timeOfDay,
    //   placeName,
    //   time,
    //   description,
    //   placeImageUrl,
    //   googleMapUrl
    // ) => {
    //   // Check if the day exists in the map
    //   if (!schedule.has(day)) {
    //     // Initialize the day's schedule with default morning and afternoon objects
    //     schedule.set(day, {
    //       morning: {},
    //       afternoon: {},
    //     });
    //   }

    //   // Get the day's schedule
    //   const daySchedule = schedule.get(day);

    //   // Update the specific time of day (morning/afternoon) schedule
    //   daySchedule[timeOfDay] = {
    //     placeName,
    //     time,
    //     description,
    //     placeImageUrl,
    //     googleMapUrl,
    //   };

    //   // Update the Map with the modified day schedule
    //   schedule.set(day, daySchedule);
    // to remove ************
    // for (const [day, dayDetails] of Object.entries(data.schedule)) {
    //   // console.log(`--- ${day} ---`);

    //   // Morning Schedule
    //   addScheduleToMap(`
    //         ${day},
    //         "Morning:",
    //         ${dayDetails.morning.placeName},
    //         ${dayDetails.morning.time},
    //         ${dayDetails.morning.description},
    //         ${dayDetails.morning.placeimageUrl},
    //         ${dayDetails.morning.googlemapUrl}
    //       `);

    //   addScheduleToMap(
    //     `${day},
    //         "Afternoon:",
    //         ${dayDetails.afternoon.placeName},
    //         ${dayDetails.afternoon.time},
    //        ${dayDetails.afternoon.description},
    //         ${dayDetails.afternoon.placeimageUrl},
    //         ${dayDetails.afternoon.googlemapUrl}
    //       `
    //   );
    // for (const [day, dayDetails] of Object.entries(data.schedule)) {
    //   // Morning Schedule
    //   addScheduleToMap({
    //     day: day,
    //     timeOfDay: "Morning",
    //     placeName: dayDetails.morning.placeName,
    //     time: dayDetails.morning.time,
    //     description: dayDetails.morning.description,
    //     placeImageUrl: dayDetails.morning.placeimageUrl,
    //     googleMapUrl: dayDetails.morning.googlemapUrl,
    //   });

    //   // Afternoon Schedule
    //   addScheduleToMap({
    //     day: day,
    //     timeOfDay: "Afternoon",
    //     placeName: dayDetails.afternoon.placeName,
    //     time: dayDetails.afternoon.time,
    //     description: dayDetails.afternoon.description,
    //     placeImageUrl: dayDetails.afternoon.placeimageUrl,
    //     googleMapUrl: dayDetails.afternoon.googlemapUrl,
    //   });
    // }

    // const sanitizedSchedule = {};
    // Object.keys(schedule).forEach((key) => {
    //   const sanitizedKey = key.replace(/\W+/g, "_"); // Replace invalid characters
    //   sanitizedSchedule[sanitizedKey] = schedule[key];
    // });

    // *************************
    let schedule = {};

for (const [day, dayDetails] of Object.entries(data.schedule)) {
  schedule[day] = {
    morning: {
      placeName: dayDetails.morning?.placeName || "Unknown Place",
      time: dayDetails.morning?.time || "Not Specified",
      description: dayDetails.morning?.description || "No Description",
      placeImageUrl: dayDetails.morning?.placeImageUrl || "default_image_url.jpg",
      googleMapUrl: dayDetails.morning?.googleMapUrl || "default_map_url",
    },
    afternoon: {
      placeName: dayDetails.afternoon?.placeName || "Unknown Place",
      time: dayDetails.afternoon?.time || "Not Specified",
      description: dayDetails.afternoon?.description || "No Description",
      placeImageUrl: dayDetails.afternoon?.placeImageUrl || "default_image_url.jpg",
      googleMapUrl: dayDetails.afternoon?.googleMapUrl || "default_map_url",
    },
  };
}


    const { email } = req.params;
    // const id = User.findOne({ email })._id;
    const tripCreated = new Trip({
      destination,
      budget,
      imageSrc,
      hotels,
      schedule: schedule,
      user: email,
    });
    await tripCreated.save();
    res.json(tripCreated);
  }
  // }

  run();
};

export { createTripController };
