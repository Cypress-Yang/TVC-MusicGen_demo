function createAudioHTML(path) {
  return '<audio controls controlslist="nodownload" class="px-1"> <source src=' +
      path +
      ' type="audio/wav">Your browser does not support the audio element.</audio>';
}


async function getText(file, cell) {
  console.log('Fetching' + file);
  const myObject = await fetch(file);
  const myText = await myObject.text();
  cell.innerHTML = myText.replaceAll('\n', '<br>');
}

async function getText_line(file, line, cell) {
  console.log('Fetching' + file);
  const myObject = await fetch(file);
  const myText = await myObject.text();
  const lines = myText.split('\n');
  cell.innerHTML = lines[line].split('\t')[1];
}


const N_MODEL = 4
const MODEL_NAMES = ["musicgen", "TV_musicgen","musicldm", "TV_musicldm"]

function generateMus2MusTable(tableId, n_samples) {
  let table = document.getElementById(tableId);
  const prefix = "audio_files/music_samples/";

  for (let i = 0; i < n_samples; i++) {
    let row = table.insertRow(i + 1);
    let orig_cell = row.insertCell(0);
    orig_cell.innerHTML = createAudioHTML(prefix+'original/'+i.toString()+'.flac', orig_cell);

    let seg_cell = row.insertCell(1);
    getText_line("audio_files/music_samples/seg.txt", i, seg_cell);

    for (let j = 0; j < N_MODEL; j++) {
      let cell = row.insertCell(j + 2);
      let cond_file = prefix + MODEL_NAMES[j] + '/' + i.toString() + '.flac';
      cell.innerHTML = createAudioHTML(cond_file, cell);
    }
  }
}

const STYLE_NAMES=["AmbientElectronic", "Chillhop", "ClassicalCrossover", "JazzFusion", "PostRock", "ProgressiveHouse", "PsychedelicRock"]




function generateTxt2MusTable(tableId, n_samples) {
  let table = document.getElementById(tableId);
  const prefix = "audio_files/text_samples/";

  for (let i = 0; i < STYLE_NAMES.length; i++) {
    let container = document.createElement("div", className="table-responsive pt-3")
    table.appendChild(container)
    let text_container = document.createElement("div");
    getText(prefix+'descriptions/'+STYLE_NAMES[i]+".txt", text_container);
    
    container.appendChild(text_container);
    // container.appendChild("<div><br><br></div>");
    let tab_container = document.createElement("div");
    tab_container.innerHTML = `<table
      class="table pt-2"
    >
    
    <thead>
      <tr>
        <th>MusicGen</th>
        <th>TVC-MusicGen</th>
        <th>MusicLDM</th>
        <th>TVC-MusicLDM</th>
      </tr>
    </thead>
      <tbody></tbody>
    </table>`;
    container.appendChild(tab_container);
    let row = tab_container.lastChild.insertRow(1);
    for (let j = 0; j < N_MODEL; j++) {
      let cell = row.insertCell(j);
      let cond_file = prefix + MODEL_NAMES[j] + '/' + STYLE_NAMES[i] + '.flac';
      cell.innerHTML = createAudioHTML(cond_file, cell);
    }
    
  }
  table.innerHTML.appendChild(container)
}








generateMus2MusTable('generation_m2m',12)
generateTxt2MusTable('generation_t2m')
// generateTxtToMusTable('generation_t2m',3)



