const fakeLocations = [
    {
        coords : {
            latitude: 37.983810,
            longitude: 23.727539
        }
    },
    {
        coords : {
            latitude: 39.983810,
            longitude: 21.723953
        }    
    },
    {
        coords : {
            latitude: 36.983810,
            longitude: 21.723953
        }    
    },
    {
        coords : {
            latitude: 29.983810,
            longitude: 23.723953
        }    
    },
    {
        coords : {
            latitude: 82.983810,
            longitude: 27.723953
        }    
    },

]

export const getFakeLocation = () => {
    return fakeLocations[Math.floor(Math.random() * fakeLocations.length)];
}