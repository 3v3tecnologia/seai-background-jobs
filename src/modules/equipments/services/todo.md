# Pass to ENDPOINT

## 1- [ ] Insert station measurements

### [POST] /measurements/station

> Add to http endpoint the logic for update ou insert stations measurement records

```js
/*Equipments codes whose measurement records have not yet been recorded*/
// Should be a HashSet to optimize search
const equipmentsCodesWithoutMeasurements =
  await repository.getEquipmentsCodesWithoutMeasurements();

const stationsToUpdate = [];
const stationsToInsert = [];

stations.forEach((station) => {
  // add to update
  if (equipmentsCodesWithoutMeasurements.has(station.Code)) {
    //add to insert
    stationsToInsert.push(station);
    return;
  }

  stationsToUpdate.push(station);
});

if (stationsToUpdate.length) await repository.update(stationsToUpdate);

if (stationsToInsert.length) await repository.update(stationsToInsert);
```

## 2 - [ ] Insert pluviometer measurements

> Add the same logic used in stations insertion measurements
