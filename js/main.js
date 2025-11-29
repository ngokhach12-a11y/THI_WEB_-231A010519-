// --- PHẦN 1: LANDING PAGE LOGIC ---

// 1. Scroll Effect: Đổi màu header khi cuộn
const header = document.getElementById('site-header');
if (header) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// 2. Thư viện ảnh (Gallery) - Chuyển đổi ảnh khi click thumbnail
function changeImage(thumb) {
    // Tìm ảnh lớn
    const mainImg = document.getElementById('current-img');
    
    // Kiểm tra xem ảnh lớn có tồn tại không (để tránh lỗi ở trang khác)
    if (mainImg) {
        // Thay đổi nguồn ảnh lớn bằng nguồn của thumbnail vừa click
        mainImg.src = thumb.src;
        
        // Xóa class 'active' ở tất cả các thumbnail cũ
        document.querySelectorAll('.thumb').forEach(img => img.classList.remove('active'));
        
        // Thêm class 'active' cho thumbnail vừa được click
        thumb.classList.add('active');
    }
}

// 3. Scroll Animation (Hiệu ứng khi lướt tới đâu hiện ra tới đó)
// Sử dụng Intersection Observer API theo yêu cầu đề bài
const observerOptions = {
    threshold: 0.2 // Kích hoạt khi thấy 20% phần tử
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show'); // Thêm class show để chạy animation CSS
            observer.unobserve(entry.target); // Chỉ chạy 1 lần rồi thôi
        }
    });
}, observerOptions);

// Áp dụng cho tất cả các phần tử có class .feature-item
document.querySelectorAll('.feature-item').forEach(el => {
    // Trước tiên thêm class hidden để ẩn nó đi
    el.classList.add('hidden'); 
    // Bắt đầu theo dõi
    observer.observe(el);
});


// --- PHẦN 2: GAME LOGIC (BÀI 02) ---

/* GIẢI THÍCH LOGIC TƯ DUY (Theo yêu cầu đề bài):
   1. Random: Dùng Math.random() để sinh số ngẫu nhiên từ 0 đến dưới 1.
      Công thức khoảng [min, max]: Math.floor(Math.random() * (max - min + 1)) + min.
      Ở đây [50, 150] -> (150 - 50 + 1) = 101. Vậy công thức là: Math.floor(Math.random() * 101) + 50.
   2. Input Validation: Kiểm tra người dùng có nhập chữ hay để trống không bằng isNaN().
*/

// Tạo số ngẫu nhiên khi trang web vừa tải
let randomNumber = Math.floor(Math.random() * 101) + 50;
let attempts = 0; // Biến đếm số lần thử

// Lấy các phần tử từ HTML
const messageEl = document.getElementById('message');
const attemptEl = document.getElementById('attempts');

function checkGuess() {
    const userInp = document.getElementById('guessInput');
    // Chuyển đổi giá trị nhập vào thành số nguyên
    const guess = parseInt(userInp.value);

    // Validate Input (Kiểm tra lỗi)
    if (isNaN(guess) || guess < 50 || guess > 150) {
        messageEl.style.color = "red";
        messageEl.textContent = "Vui lòng nhập số hợp lệ từ 50 đến 150!";
        return; // Dừng hàm lại, không chạy tiếp
    }

    // Tăng số lần thử
    attempts++;
    if(attemptEl) attemptEl.textContent = attempts;

    // So sánh kết quả
    if (guess === randomNumber) {
        messageEl.style.color = "green";
        messageEl.textContent = `CHÍNH XÁC! Số bí mật là ${randomNumber}`;
        createConfetti(); // Gọi hiệu ứng pháo hoa giấy
        
        // Disable nút đoán để không bấm tiếp được
        userInp.disabled = true;
    } else if (guess < randomNumber) {
        messageEl.style.color = "orange";
        messageEl.textContent = "Thấp quá! Thử số lớn hơn xem.";
    } else {
        messageEl.style.color = "orange";
        messageEl.textContent = "Cao quá! Thử số nhỏ hơn xem.";
    }
}

// Hàm chơi lại
function resetGame() {
    // Random số mới
    randomNumber = Math.floor(Math.random() * 101) + 50;
    attempts = 0;
    
    // Reset giao diện
    if(attemptEl) attemptEl.textContent = attempts;
    messageEl.textContent = "";
    const userInp = document.getElementById('guessInput');
    userInp.value = "";
    userInp.disabled = false; // Mở khóa ô nhập
    
    // Xóa confetti cũ nếu có
    document.querySelectorAll('.confetti').forEach(e => e.remove());
}

// Hàm tạo hiệu ứng Confetti đơn giản bằng JS + CSS (Logic thuật toán bổ sung)
function createConfetti() {
    const colors = ['#f00', '#0f0', '#00f', '#ff0', '#0ff', '#e91e63'];
    
    // Tạo 50 mảnh giấy
    for (let i = 0; i < 50; i++) {
        const conf = document.createElement('div');
        conf.classList.add('confetti');
        
        // Vị trí ngẫu nhiên theo chiều ngang (left: 0% -> 100%)
        conf.style.left = Math.random() * 100 + 'vw';
        
        // Màu sắc ngẫu nhiên từ mảng colors
        conf.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        
        // Tốc độ rơi ngẫu nhiên (2s -> 5s)
        conf.style.animationDuration = (Math.random() * 3 + 2) + 's';
        
        // Thêm vào body
        document.body.appendChild(conf);
        
        // Tự xóa phần tử khỏi DOM sau 5 giây để nhẹ máy
        setTimeout(() => conf.remove(), 5000);
    }
}
