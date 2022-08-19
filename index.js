import { fromEvent, of, timer } from "rxjs";
import { ajax } from "rxjs/ajax";
import {
  mergeMapTo,
  takeUntil,
  tap,
  finalize,
  switchMapTo,
  pluck,
} from "rxjs/operators";

const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");
const pollingStatus = document.getElementById("polling-status");

const startClick$ = fromEvent(startButton, "click");
const stopClick$ = fromEvent(stopButton, "click");
const dogImage = document.getElementById("dog");

startClick$
  .pipe(
    mergeMapTo(
      timer(0, 5000).pipe(
        tap(() => (pollingStatus.innerHTML = "Active")),
        switchMapTo(
          ajax.getJSON("https://random.dog/woof.json").pipe(pluck("url"))
        ),
        takeUntil(stopClick$),
        finalize(() => (pollingStatus.innerHTML = "Stopped"))
      )
    )
  )
  .subscribe((url) => (dogImage.src = url));
