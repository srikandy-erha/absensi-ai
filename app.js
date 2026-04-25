// INIT FIREBASE
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// LOGIN
function login() {
  auth.signInWithEmailAndPassword(email.value, password.value)
    .then(() => location.href = "dashboard.html");
}

// REGISTER
async function register() {
  const res = await auth.createUserWithEmailAndPassword(email.value, password.value);
  await db.collection("users").doc(res.user.uid).set({
    email: email.value,
    role: "karyawan"
  });
}

// RESET PASSWORD
function lupaPassword() {
  auth.sendPasswordResetEmail(email.value);
}

// ABSEN + FACE CHECK
async function absen() {
  const user = auth.currentUser;

  const descriptor = await getDescriptor();
  if (!descriptor) return alert("Wajah tidak terdeteksi");

  const callable = firebase.functions().httpsCallable('validasiWajah');
  const res = await callable({ descriptor });

  if (!res.data.match) return alert("Wajah tidak cocok");

  navigator.geolocation.getCurrentPosition(async pos => {
    await db.collection("absensi").add({
      uid: user.uid,
      waktu: new Date(),
      type: "masuk",
      lokasi: pos.coords
    });
  });
}