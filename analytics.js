db.collection("absensi").onSnapshot(snapshot => {

  let perHari = {};
  let skor = {};
  let telat = {};

  snapshot.forEach(doc => {
    const d = doc.data();
    const tgl = new Date(d.waktu.seconds * 1000).toISOString().split("T")[0];

    perHari[tgl] = (perHari[tgl] || 0) + 1;

    if (!skor[d.uid]) skor[d.uid] = 0;
    skor[d.uid]++;

    // telat
    const jam = new Date(d.waktu.seconds * 1000).getHours();
    if (jam > 8) telat[tgl] = (telat[tgl] || 0) + 1;
  });

  renderChart(perHari);
  renderChartTelat(telat);
  renderRanking(skor);
});

function renderChart(data) {
  new Chart(chartAbsensi, {
    type: "line",
    data: {
      labels: Object.keys(data),
      datasets: [{ data: Object.values(data) }]
    }
  });
}

function renderChartTelat(data) {
  new Chart(chartTelat, {
    type: "bar",
    data: {
      labels: Object.keys(data),
      datasets: [{ data: Object.values(data) }]
    }
  });
}

function renderRanking(data) {
  let sorted = Object.entries(data).sort((a,b)=>b[1]-a[1]);

  ranking.innerHTML = sorted.map((d,i)=>
    `<p>${i+1}. ${d[0]} (${d[1]})</p>`
  ).join("");
}