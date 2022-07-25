const mongoose = require("mongoose");
const { Floor } = require("../models/floors");
const { getClayPitchesData } = require("../apiServices/cnftjungleApi");


async function updatePitchesFloors() {
        //   mongoose.connect(`mongodb://localhost/TellMeMyWorth`)
    //   mongoose.connect(`mongodb+srv://TellTwan:q23LUx8K0617E5pa@TellMeMyWorth-CoreDB-6341cc4d.mongo.ondigitalocean.com/TellMeMyWorth?authSource=admin&replicaSet=TellMeMyWorth-CoreDB&tls=true`)
        //   .then(() => console.log('Connecting to MongoDB...'))
        //   .catch(err => console.error('Could not connect to MongoDB...', err));
    
    // console.log(await getClayPitchesData())
    let clayPitchFloors = {
        'Small Sonic Village': 0,
        'Medium Sonic Village': 0,
        'Large Sonic Village': 0,
        'Small Underworld': 0,
        'Medium Underworld': 0,
        'Large Underworld': 0,
        'Small Baked Nation': 0,
        'Medium Baked Nation': 0,
        'Large Baked Nation': 0,
    }

    // console.log(clayPitchFloors)
            // console.log(clayPitchFloors['Small Sonic Village'])


    const clayPitchesData = await getClayPitchesData()

    clayPitchesData.forEach(clayPitch => {
        // if(clayPitch.traits.size === 'small' && clayPitch.traits.zone === 'sonic village') {
        // console.log(clayPitch.traits.size)
        // console.log(clayPitch.traits.zone)
        // console.log(clayPitch.listing_price)
        // console.log(clayPitchFloors['Small Sonic Village'])
        // }
        if(clayPitch.listing_price != null){
            if(clayPitch.traits.size === 'small' && clayPitch.traits.zone === 'sonic village'){
                // console.log('HERE')
                if(clayPitch.listing_price < clayPitchFloors['Small Sonic Village'] || clayPitchFloors['Small Sonic Village'] === 0){
                    clayPitchFloors['Small Sonic Village'] = clayPitch.listing_price
                }
            } else if(clayPitch.traits.size === 'medium' && clayPitch.traits.zone === 'sonic village'){
                if(clayPitch.listing_price < clayPitchFloors['Medium Sonic Village'] || clayPitchFloors['Medium Sonic Village'] === 0){
                    clayPitchFloors['Medium Sonic Village'] = clayPitch.listing_price
                }
            } else if(clayPitch.traits.size === 'large' && clayPitch.traits.zone === 'sonic village'){
                if(clayPitch.listing_price < clayPitchFloors['Large Sonic Village'] || clayPitchFloors['Large Sonic Village'] === 0){
                    clayPitchFloors['Large Sonic Village'] = clayPitch.listing_price
                }
            } else if(clayPitch.traits.size === 'small' && clayPitch.traits.zone === 'underworld'){
                if(clayPitch.listing_price < clayPitchFloors['Small Underworld'] || clayPitchFloors['Small Underworld'] === 0){
                    clayPitchFloors['Small Underworld'] = clayPitch.listing_price
                }
            } else if(clayPitch.traits.size === 'medium' && clayPitch.traits.zone === 'underworld'){
                if(clayPitch.listing_price < clayPitchFloors['Medium Underworld'] || clayPitchFloors['Medium Underworld'] === 0){
                    clayPitchFloors['Medium Underworld'] = clayPitch.listing_price
                }
            } else if(clayPitch.traits.size === 'large' && clayPitch.traits.zone === 'underworld'){
                if(clayPitch.listing_price < clayPitchFloors['Large Underworld'] || clayPitchFloors['Large Underworld'] === 0){
                    clayPitchFloors['Large Underworld'] = clayPitch.listing_price
                }
            } else if(clayPitch.traits.size === 'small' && clayPitch.traits.zone === 'baked nation' || clayPitchFloors['Small Baked Nation'] === 0){
                if(clayPitch.listing_price < clayPitchFloors['Small Baked Nation'] || clayPitchFloors['Small Baked Nation'] === 0){
                    clayPitchFloors['Small Baked Nation'] = clayPitch.listing_price
                }
            } else if(clayPitch.traits.size === 'medium' && clayPitch.traits.zone === 'baked nation'){
                if(clayPitch.listing_price < clayPitchFloors['Medium Baked Nation'] || clayPitchFloors['Medium Baked Nation'] === 0){
                    clayPitchFloors['Medium Baked Nation'] = clayPitch.listing_price
                }
            } else if(clayPitch.traits.size === 'large' && clayPitch.traits.zone === 'baked nation'){
                if(clayPitch.listing_price < clayPitchFloors['Large Baked Nation'] || clayPitchFloors['Large Baked Nation'] === 0){
                    clayPitchFloors['Large Baked Nation'] = clayPitch.listing_price
                }
            }
        }
    })

    console.log([clayPitchFloors])

    let traitFloors = [clayPitchFloors]

    await Floor.updateOne(
        { policy_id: '13e3f9964fe386930ec178d12a43c96a7f5841270c2146fc509a9f3e' },
        {
          $set: {
            trait_floors: traitFloors,
            date: Date.now(),
          },
        }
    )


}

// updatePitchesFloors()
exports.updatePitchesFloors = updatePitchesFloors;
