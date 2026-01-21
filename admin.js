// admin.js
import { db } from './app.js'; // استيراد قاعدة البيانات من الملف الرئيسي
import { collection, addDoc, getDocs, deleteDoc, doc } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// دالة إضافة منتج
document.getElementById('btn-add').addEventListener('click', async () => {
    const name = document.getElementById('p-name').value;
    const price = document.getElementById('p-price').value;
    const img = document.getElementById('p-img').value;
    const msg = document.getElementById('msg');

    if (!name || !price) { alert("أكمل البيانات"); return; }

    msg.innerText = "جاري النشر...";
    
    try {
        await addDoc(collection(db, "products"), {
            name: name,
            price: price,
            image: img || "https://placehold.co/150",
            createdAt: new Date()
        });
        
        msg.innerText = "تم النشر بنجاح!";
        msg.style.color = "green";
        
        // تفريغ الحقول وتحديث الجدول
        document.getElementById('p-name').value = "";
        document.getElementById('p-price').value = "";
        loadProducts(); 
        
    } catch (error) {
        msg.innerText = "خطأ: " + error.message;
        msg.style.color = "red";
    }
});

// دالة جلب المنتجات وعرضها في الجدول
async function loadProducts() {
    const querySnapshot = await getDocs(collection(db, "products"));
    const tbody = document.getElementById('table-body');
    const countBox = document.getElementById('prod-count');
    
    tbody.innerHTML = ""; // مسح الجدول القديم
    let count = 0;

    querySnapshot.forEach((docItem) => {
        count++;
        const p = docItem.data();
        const row = `
            <tr>
                <td><img src="${p.image}" width="50" style="border-radius:5px"></td>
                <td>${p.name}</td>
                <td>${p.price} ج.م</td>
                <td><button style="background:red; padding:5px 10px; font-size:0.8rem;" onclick="deleteProduct('${docItem.id}')" class="btn">حذف</button></td>
            </tr>
        `;
        tbody.innerHTML += row;
    });

    countBox.innerText = count;
}

// دالة الحذف (نضيفها للنافذة لتكون متاحة في HTML)
window.deleteProduct = async (id) => {
    if(confirm("هل أنت متأكد من حذف هذا المنتج؟")) {
        await deleteDoc(doc(db, "products", id));
        loadProducts(); // تحديث الجدول
    }
}

// تشغيل التحميل عند فتح الصفحة
loadProducts();
