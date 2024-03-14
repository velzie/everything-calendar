import { Checkbox } from "./checkbox.js";
import { borderbox, col, flex, h100, w100, gap, wevenly } from "./css.js";
import { Tracker } from "./tracker.js";

export const global = $store({
  trackers: []
}, "global", "localstorage");

export function NewTracker() {
  this.css = css`
self {
  background-color: var(--overlay);
  border-radius: 5px;
  padding: 1em;
}

self > * {
  margin-bottom: 0.5em;
}

.title {
  font-size: 1.5em;
}
`
  this.gradated = false;
  this.inverse = false;
  this.title = "Name";
  return html`
    <div>
      <h2>Add New</h2>
      <input class="title" bind:value=${use(this.title)} />
      <${Checkbox} bind:checked=${use(this.gradated)}>Gradated? (1-10 instead of yes/no)</${Checkbox}>

      <button on:click=${() => {
      let tracker = stateful({
        years: stateful({}),
        gradated: this.gradated,
        inverse: this.inverse,
        title: this.title
      });

      global.trackers = [tracker, ...global.trackers];
    }}>Create</button>
    </div>
  `
}

export function App() {
  this.css = css`
self {
  background-color: var(--base);
  padding: 0.5em;
  overflow-y: scroll;
}
`;

  return html`
  <div class=${[borderbox, w100, flex, col, gap]}>
    ${use(global.trackers, trackers => trackers.map(tracker => html`<${Tracker} tracker=${tracker}></${Tracker}>`))}
    <${NewTracker}></${NewTracker}>
  </div>`;

}

// fix stateful shit
for (let i in global.trackers) {
  let tracker = global.trackers[i];
  tracker.years = stateful(tracker.years);
  for (let yearnum in tracker.years) {
    let year = tracker.years[yearnum]
    for (let day in year) {
      year[day] = stateful(year[day]);
    }
  }

  global.trackers[i] = stateful(tracker);
}

document.getElementById("root").appendChild(html`<${App}/>`)
