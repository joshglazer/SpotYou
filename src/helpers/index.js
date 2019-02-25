export function stepClassName(stepCheck, stepActive) {
  if (stepCheck === stepActive) {
    return "active";
  } else if (stepCheck <= stepActive) {
    return "complete";
  } else {
    return "inactive";
  }
}
