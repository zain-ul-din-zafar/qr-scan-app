export default interface Machine {
  uid: string;
  inletPressure: number;
  outletPressure: number;
  created_at: Date;
  diffPressureIndication: number;
  oilLevel: number;
  photo: string;
}
