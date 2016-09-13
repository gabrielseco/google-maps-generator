const getGeoLocation = () => {
  return new Promise(function(resolve, reject){

    function positionSuccess(position){
      resolve(position);
    }

    function positionError(error){
      reject('ERROR: ' + error.code + ': ' + error.message);
    }

    navigator.geolocation.getCurrentPosition(positionSuccess, positionError);

  });
};

async function getLocation() {
  const response = await getGeoLocation();
  return response;
}


const getPosition = getLocation;

export default getPosition;
