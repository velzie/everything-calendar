import { global } from "./app.js";
import { Checkbox } from "./checkbox.js";
import { borderbox, col, flex, h100, w100, gap, wevenly } from "./css.js";

export function daysInYear(year) {
  return ((year % 4 === 0 && year % 100 > 0) || year % 400 == 0) ? 366 : 365;
}
export function daysIntoYear(date) {
  return (Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) - Date.UTC(date.getFullYear(), 0, 0)) / 24 / 60 / 60 / 1000;
}

export function Calendar() {
  this.css = css`
self {
  display: grid;

  grid-auto-flow:column;
  grid-template-rows: repeat(7, min-content);

  gap: 3px;
  padding: 0.5em;
  border-radius: 5px;
  background-color: var(--overlay);
  width: min-content;
}

.day {
  width: 12px;
  height: 12px;
  border-radius: 2px;
}

.day.active {
  background-color: var(--foam);
}

.day.unset {
  background-color: var(--muted);
}

.day.inactive {
  background-color: var(--highlight-med);
}

.day.currentday {
  outline: 2px solid var(--foam);
  border: none;
}
`;
  this.activeday = daysIntoYear(new Date);
  let currentday = daysIntoYear(new Date);

  let tracker = this.tracker;
  let days = tracker.years[this.year];

  return html`
  <div>
    ${days.map(
    (day, i) => {
      let div = html`
      <div
        class=${["day",
          use(day.value, v => v ? (tracker.gradated ? "a" : "active") : "unset"),
          currentday < i && "inactive",
          use(this.activeday, day => day == i && "currentday")
        ]}
        on:click=${() => {
          if (currentday >= i) {
            this.activeday = i;
            this.select(day);
          }
        }} />`

      if (tracker.gradated)
        handle(use(day.value), () => {
          if (!day.value) {
            div.style.backgroundColor = "";
            return;
          }
          let mapped = day.value;
          if (mapped > 10) mapped = 10;
          mapped *= 5;
          mapped += 10;
          div.style.backgroundColor = `hsl(189, 43%, ${mapped}%)`
        });
      return div;
    }
  )}
  </div>
  `
}


export function Tracker() {
  this.css = css`
self {
  background-color: var(--surface);
  border-radius: 5px;
  padding: 1em;
}
.title {
  font-size: 1.5em;
}


.dayctl {
  > div {
    gap: 5px;
  }
}
`;
  let tracker = this.tracker;

  let thisday = daysIntoYear(new Date);
  let thisyear = new Date().getFullYear();

  function makeDay() {
    return stateful({
      value: tracker.gradated ? 0 : false
    });
  }
  if (!(thisyear in tracker.years)) {
    tracker.years[thisyear] = Array(daysInYear(this.year)).fill(0).map(makeDay);
    tracker.years = tracker.years;
  }

  let cells = tracker.years[thisyear];
  this.daycell = cells[thisday];
  this.selectedyear = thisyear;
  this.selecteddayindex = thisday;


  handle(use(this.selecteddayindex), () =>
    this.formattedday = new Date(this.selectedyear, 0, this.selecteddayindex + 1).toLocaleDateString(navigator.language, {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    })
  );


  return html`
  <div class=${[flex, col]}>
    <div class="title">${tracker.title}</div>
    ${use(tracker.years, years =>
    Object.entries(years).map(([year, days]) => html`
      <div>
        <div class="yeartext">${year}</div>
        <${Calendar} select=${cell => {
        this.daycell = cell;
        this.selectedyear = year;
        this.selecteddayindex = days.indexOf(cell);
      }} year=${year} tracker=${tracker}></${Calendar}>
      </div>`
    ))}
    <div>
      ${use(this.formattedday)}
    </div>
    <div class=${["dayctl", flex, wevenly]}>
      ${$if(tracker.gradated,
      html`
          <div class=${[flex,]}>
            <button on:click=${() => { if (this.daycell.value > 0) this.daycell.value-- }}>&lt;</button>
            <input bind:value=${use(this.daycell.value)} />
            <button on:click=${() => this.daycell.value++}>&gt;</button>
          </div>
          `,
      html`<${Checkbox} bind:checked=${use(this.daycell.value)}></${Checkbox}>`,
    )}
      <button on:click=${() => global.trackers = global.trackers.filter(t => t != tracker)}>Delete tracker</button>
    </div>
  </div>`;
}
