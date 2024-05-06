export class EquipmentMapper {
  static toDomain(equipment) {
    return {
      Code: equipment.Code,
      Name: equipment.Name,
      Altitude: equipment.Altitude,
      Location: {
        Latitude: equipment.Latitude,
        Longitude: equipment.Longitude,
      },
      Id_Organ: equipment.Id_Organ,
      Id_Type: null,
      Enabled: false,
    };
  }
  static toPersistency(equipment) {
    return {
      IdEquipmentExternal: equipment.Code,
      Name: equipment.Name,
      Altitude: equipment.Altitude,
      Location: equipment.Location,
      FK_Type: equipment.Id_Type,
      FK_Organ: equipment.Id_Organ,
      Enabled: equipment.Enabled,
    };
  }
}
