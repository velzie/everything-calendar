export function Checkbox() {
  this.css = css`
cursor: pointer;
outline: none;
border-radius: 3px;
border: none;
padding: 0;
font-weight: bold;
line-height: 1.1;
font-size:1.25em;
display: grid;
grid-template-columns: 1em auto;
gap: 0.5em;

input[type="checkbox"] {
  border: 3px solid var(--highlight-med);
  appearance: none;
  margin: 0;
  aspect-ratio: 1/1;
}
`

  handle(use(this.checked), () => {
    console.log(this.checked);
  });
  return html`
    <label>
      <input type="checkbox" bind:checked=${use(this.checked)} 
      style=${{
      backgroundColor: use(this.checked, c => c ? "var(--love)" : "var(--muted)")
    }}
      />
      ${this.children}
    </label>
  `

}
