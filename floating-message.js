// Add floating message button to all pages
document.addEventListener('DOMContentLoaded', function() {
    // Create floating message button
    const floatingBtn = document.createElement('button');
    floatingBtn.className = 'floating-message-btn';
    floatingBtn.setAttribute('data-bs-toggle', 'modal');
    floatingBtn.setAttribute('data-bs-target', '#knowPriceModal');
    floatingBtn.setAttribute('title', 'Narxni bilish');
    floatingBtn.innerHTML = '<i class="fas fa-comment-dots"></i>';
    
    // Create modal
    const modalHTML = `
        <div class="modal fade" id="knowPriceModal" tabindex="-1" aria-labelledby="knowPriceModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="knowPriceModalLabel">💰 Narxni Bilish</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form id="priceForm">
                            <div class="form-group">
                                <label for="fullName">
                                    <span class="icon">👤</span>Ism va Familiya
                                </label>
                                <input type="text" id="fullName" name="fullName" required placeholder="Ismingiz va familiyangizni kiriting">
                            </div>

                            <div class="form-group">
                                <label for="phoneNumber">
                                    <span class="icon">📱</span>Telefon Raqami
                                </label>
                                <input type="tel" id="phoneNumber" name="phoneNumber" required placeholder="+998901234567">
                            </div>

                            <div class="form-group">
                                <label for="productUrl">
                                    <span class="icon">🔗</span>Mahsulot Havolasi (URL)
                                </label>
                                <input type="url" id="productUrl" name="productUrl" required placeholder="https://example.com/product">
                            </div>

                            <div class="form-group">
                                <label for="productName">
                                    <span class="icon">📦</span>Mahsulot Nomi
                                </label>
                                <textarea id="productName" name="productName" required placeholder="Mahsulot nomini kiriting"></textarea>
                            </div>

                            <button type="submit" class="submit-btn">
                                <span class="btn-text">📤 So'rov Yuborish</span>
                                <div class="loading">
                                    <div class="spinner"></div>
                                </div>
                            </button>
                        </form>

                        <div class="success-message" id="successMessage">
                            ✅ So'rovingiz muvaffaqiyatli yuborildi! Tez orada javob beramiz.
                        </div>

                        <div class="error-message" id="errorMessage">
                            ❌ Xatolik yuz berdi. Iltimos, qayta urinib ko'ring.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Add button and modal to body
    document.body.appendChild(floatingBtn);
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Add styles
    const styles = document.createElement('style');
    styles.textContent = `
        .floating-message-btn {
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: linear-gradient(45deg, var(--primary-color), var(--secondary-color));
            color: white;
            border: none;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            transition: all 0.3s ease;
            z-index: 1000;
        }

        .floating-message-btn:hover {
            transform: scale(1.1);
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
        }

        .floating-message-btn i {
            transition: transform 0.3s ease;
        }

        .floating-message-btn:hover i {
            transform: scale(1.2);
        }

        @media (max-width: 768px) {
            .floating-message-btn {
                width: 50px;
                height: 50px;
                font-size: 20px;
                bottom: 20px;
                right: 20px;
            }
        }

        .form-group {
            margin-bottom: 20px;
        }

        .form-group label {
            display: block;
            margin-bottom: 8px;
            font-weight: 600;
        }

        .form-group input,
        .form-group textarea {
            width: 100%;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 8px;
            font-size: 16px;
        }

        .submit-btn {
            width: 100%;
            padding: 12px;
            background: linear-gradient(45deg, var(--primary-color), var(--secondary-color));
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            position: relative;
        }

        .loading {
            display: none;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }

        .spinner {
            width: 20px;
            height: 20px;
            border: 2px solid #ffffff;
            border-top: 2px solid transparent;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        .success-message,
        .error-message {
            display: none;
            padding: 15px;
            border-radius: 8px;
            margin-top: 20px;
            text-align: center;
        }

        .success-message {
            background-color: #d4edda;
            color: #155724;
        }

        .error-message {
            background-color: #f8d7da;
            color: #721c24;
        }
    `;
    document.head.appendChild(styles);

    // Form submission handler
    const form = document.getElementById('priceForm');
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const submitBtn = form.querySelector('.submit-btn');
        const btnText = submitBtn.querySelector('.btn-text');
        const loading = submitBtn.querySelector('.loading');
        const successMessage = document.getElementById('successMessage');
        const errorMessage = document.getElementById('errorMessage');
        
        // Hide previous messages
        successMessage.style.display = 'none';
        errorMessage.style.display = 'none';
        
        // Show loading state
        submitBtn.disabled = true;
        btnText.style.display = 'none';
        loading.style.display = 'block';

        // Get form data
        const formData = new FormData(form);
        const fullName = formData.get('fullName');
        const phoneNumber = formData.get('phoneNumber');
        const productUrl = formData.get('productUrl');
        const productName = formData.get('productName');

        // Create message
        const message = `
🛍️ <b>YANGI NARX SO'ROVI</b>

👤 <b>Mijoz:</b> ${fullName}
📱 <b>Telefon:</b> ${phoneNumber}

📦 <b>Mahsulot:</b> ${productName}
🔗 <b>Havola:</b> ${productUrl}

📅 <b>Sana:</b> ${new Date().toLocaleString('uz-UZ')}

💬 <i>Ushbu mijozga tez orada javob bering!</i>
        `;

        try {
            const TELEGRAM_BOT_TOKEN = '7670633072:AAFqhahrboKp7w3k3tSsk4SQP1RFrXUq1m4';
            const TELEGRAM_CHAT_IDS = ['6226950895', '7856355769', '9876543210'];
            
            let successCount = 0;
            let failedCount = 0;

            for (const chatId of TELEGRAM_CHAT_IDS) {
                try {
                    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            chat_id: chatId,
                            text: message,
                            parse_mode: 'HTML'
                        })
                    });

                    if (response.ok) {
                        successCount++;
                    } else {
                        failedCount++;
                    }
                } catch (error) {
                    failedCount++;
                }
            }
            
            if (successCount > 0) {
                successMessage.style.display = 'block';
                if (successCount === TELEGRAM_CHAT_IDS.length) {
                    successMessage.innerHTML = '✅ So\'rovingiz muvaffaqiyatli barcha adminlarga yuborildi!';
                } else {
                    successMessage.innerHTML = `✅ So'rovingiz ${successCount} ta admindan yuborildi!`;
                }
                form.reset();
            } else {
                throw new Error('All sends failed');
            }
        } catch (error) {
            console.error('Error:', error);
            errorMessage.style.display = 'block';
        } finally {
            // Reset button state
            submitBtn.disabled = false;
            btnText.style.display = 'inline';
            loading.style.display = 'none';
        }
    });

    // Phone number formatting
    const phoneInput = document.getElementById('phoneNumber');
    phoneInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.startsWith('998')) {
            value = '+' + value;
        } else if (value.length > 0 && !value.startsWith('998')) {
            value = '+998' + value;
        }
        
        if (value.length > 13) {
            value = value.slice(0, 13);
        }
        
        e.target.value = value;
    });

    // Load user data when modal opens
    document.getElementById('knowPriceModal').addEventListener('show.bs.modal', function () {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        
        if (isLoggedIn && currentUser) {
            document.getElementById('fullName').value = currentUser.fullName || '';
            document.getElementById('phoneNumber').value = currentUser.phoneNumber || '';
        }
    });
}); 