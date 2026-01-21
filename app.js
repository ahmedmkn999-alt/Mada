// app.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// إعدادات فايربيز (بياناتك)
const firebaseConfig = {
    apiKey: "AIzaSyDjcasRq39qOX04V-69W90VhX3VTPXaRxs",
    authDomain: "mada-93de8.firebaseapp.com",
    projectId: "mada-93de8",
    storageBucket: "mada-93de8.firebasestorage.app",
    messagingSenderId: "107022541072",
    appId: "1:107022541072:web:7ca31aae8ac39beacd0595"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// دالة التحقق من المستخدم (تشتغل في كل الصفحات)
function checkAuth(currentPage) {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            // لو المستخدم مسجل، وهو في صفحة الدخول، نوديه الرئيسية
            if(currentPage === 'index') window.location.href = 'home.html';
        } else {
            // لو المستخدم مش مسجل، وهو في الرئيسية، نرجعه الدخول
            if(currentPage === 'home') window.location.href = 'index.html';
        }
    });
}

// دالة تسجيل الدخول
window.loginUser = async (email, pass) => {
    try {
        await signInWithEmailAndPassword(auth, email, pass);
        window.location.href = 'home.html';
    } catch (error) {
        alert("خطأ: " + error.code);
    }
}

// دالة إنشاء الحساب
window.registerUser = async (email, pass, additionalData) => {
    try {
        const cred = await createUserWithEmailAndPassword(auth, email, pass);
        // حفظ البيانات الإضافية
        await setDoc(doc(db, "users", cred.user.uid), additionalData);
        window.location.href = 'home.html';
    } catch (error) {
        alert("خطأ في التسجيل: " + error.code);
    }
}

// دالة الخروج
window.logoutUser = () => {
    signOut(auth).then(() => window.location.href = 'index.html');
}

// تصدير الدوال للاستخدام الداخلي لو احتجنا
export { auth, db, checkAuth };
