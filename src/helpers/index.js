import logo from '../images/logo.png';

export function stepClassName(stepCheck, stepActive) {
  if (stepCheck === stepActive) {
    return "active";
  } else if (stepCheck <= stepActive) {
    return "complete";
  } else {
    return "inactive";
  }
}

export function handleBrokenImage(event) {
  event.target.src = logo;
}
