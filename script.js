document.addEventListener('DOMContentLoaded', () => {
    // --- UI ELEMENTS ---
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const chatMessages = document.getElementById('chat-messages');
    const chatSuggestions = document.getElementById('chat-suggestions');
    const modalOverlay = document.getElementById('modal-overlay');
    const modalTitle = document.getElementById('modal-title');
    const modalIcon = document.getElementById('modal-icon');
    const modalBody = document.getElementById('modal-body');
    const closeModal = document.getElementById('close-modal');

    // --- SUGGESTIONS LOGIC ---
    const suggestions = [
        { text: "Tư vấn chuyến đi THCS", icon: "fa-graduation-cap" },
        { text: "An toàn tại Củ Chi?", icon: "fa-shield-alt" },
        { text: "Ngân sách 200k đi đâu?", icon: "fa-wallet" },
        { text: "Cách điểm danh đoàn đông", icon: "fa-users-cog" },
        { text: "Địa điểm teambuilding", icon: "fa-fist-raised" }
    ];

    function initSuggestions() {
        if (!chatSuggestions) return;
        chatSuggestions.innerHTML = '';
        suggestions.forEach(s => {
            const chip = document.createElement('div');
            chip.className = 'suggestion-chip';
            chip.innerHTML = `<i class="fas ${s.icon}"></i> ${s.text}`;
            chip.addEventListener('click', () => {
                if (chatInput) {
                    chatInput.value = s.text;
                    const event = new Event('submit', { cancelable: true });
                    chatForm.dispatchEvent(event);
                }
            });
            chatSuggestions.appendChild(chip);
        });
    }

    initSuggestions();

    // --- SPA NAVIGATION LOGIC ---
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.page-section');

    function showSection(sectionId) {
        sections.forEach(sec => {
            sec.classList.remove('active');
            sec.style.display = 'none';
        });
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
            targetSection.style.display = 'block';
        }

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-section') === sectionId) {
                link.classList.add('active');
            }
        });
    }

    // Expose showSection globally for buttons
    window.showSection = showSection;

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = link.getAttribute('data-section');
            showSection(sectionId);
            window.location.hash = sectionId;
        });
    });

    // Handle initial hash or default to home
    const initialHash = window.location.hash.substring(1) || 'home';
    showSection(initialHash);

    // --- LOCATION DETAIL LOGIC ---
    const locLinks = document.querySelectorAll('.loc-link');
    const detailContent = document.getElementById('detail-content');

    locLinks.forEach(link => {
        link.addEventListener('click', () => {
            const locKey = link.getAttribute('data-loc');
            const locData = locationsKB[locKey];
            const imgUrl = link.closest('.location-item').querySelector('img').src;

            if (locData && detailContent) {
                let formattedInfo = locData.deepInfo.replace(/\n/g, '<br>')
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/✅/g, '<span style="color: #10b981;">✅</span>')
                    .replace(/❌/g, '<span style="color: #ef4444;">❌</span>');

                let formattedDebate = locData.debate.replace(/\n/g, '<br>')
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/⚠️/g, '<span style="color: #f59e0b;">⚠️</span>');

                detailContent.innerHTML = `
                    <div class="location-detail-container">
                        <h2 style="text-align: center; margin-bottom: 30px;">${locData.name}</h2>
                        <img src="${imgUrl}" class="detail-img" alt="${locData.name}">
                        
                        <div class="detail-info-block">
                            <h4><i class="fas fa-info-circle"></i> Giới thiệu</h4>
                            <p>${locData.desc.replace(/\n/g, '<br>')}</p>
                        </div>

                        ${locData.address ? `
                        <div class="detail-info-block">
                            <h4><i class="fas fa-map-marker-alt"></i> Địa chỉ</h4>
                            <p>${locData.address.replace(/\n/g, '<br>')}</p>
                        </div>` : ''}

                        ${locData.eduValue ? `
                        <div class="detail-info-block">
                            <h4><i class="fas fa-graduation-cap"></i> Giá trị giáo dục</h4>
                            <p>${locData.eduValue.replace(/\n/g, '<br>')}</p>
                        </div>` : ''}

                        ${locData.activities ? `
                        <div class="detail-info-block">
                            <h4><i class="fas fa-walking"></i> Hoạt động trải nghiệm</h4>
                            <p>${locData.activities.replace(/\n/g, '<br>')}</p>
                        </div>` : ''}

                        ${locData.suitability ? `
                        <div class="detail-info-block">
                            <h4><i class="fas fa-user-friends"></i> Phù hợp với</h4>
                            <p>${locData.suitability.replace(/\n/g, '<br>')}</p>
                        </div>` : ''}

                        ${locData.schedule ? `
                        <div class="detail-info-block">
                            <h4><i class="fas fa-calendar-alt"></i> Gợi ý lịch trình</h4>
                            <p>${locData.schedule.replace(/\n/g, '<br>')}</p>
                        </div>` : ''}

                        ${locData.cost ? `
                        <div class="detail-info-block">
                            <h4><i class="fas fa-ticket-alt"></i> Chi phí tham quan</h4>
                            <p>${locData.cost.replace(/\n/g, '<br>')}</p>
                        </div>` : ''}

                        <div class="detail-info-block">
                            <h4><i class="fas fa-clipboard-check"></i> Lưu ý an toàn & Tổ chức</h4>
                            <div>${formattedInfo}</div>
                        </div>

                        <div class="detail-info-block" style="border-left: 5px solid #f59e0b;">
                            <h4><i class="fas fa-lightbulb"></i> Góc nhìn từ chuyên gia STA</h4>
                            <div>${formattedDebate}</div>
                        </div>
                    </div>
                `;
                showSection('location-detail');
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    });

    // Helper to open location detail from outside the locations list (e.g. from gallery)
    window.openLocationDetail = (locKey) => {
        const link = document.querySelector(`.loc-link[data-loc="${locKey}"]`);
        if (link) {
            link.click();
        }
    };

    // --- Data for Introduction Pop-ups (Index Page) ---
    const introData = {
        'Giới thiệu Web': {
            icon: 'fa-info-circle',
            content: `<strong>SchoolTrip AI (STA)</strong> là hệ thống quản trị rủi ro và tư vấn du lịch học đường tiên tiến nhất hiện nay, được phát triển để chuẩn hóa mọi hành trình trải nghiệm của học sinh. <br><br>
            Chúng tôi không chỉ cung cấp thông tin, chúng tôi cung cấp <strong>Giải pháp và Sự an tâm</strong>. Bằng cách kết hợp giữa 13 danh mục quản trị và nhiều địa điểm du lịch, STA hỗ trợ nhà trường kiểm soát tuyệt đối mọi tình huống từ pháp lý, vận chuyển đến an toàn thực phẩm.<br><br>
            Đặc biệt, trợ lý ảo STA thế hệ mới có khả năng <strong>Phản biện ngữ cảnh chéo</strong>, giúp nhận diện và giải quyết các vấn đề đặc thù tại từng địa điểm cụ thể một cách chính xác 100%.`
        },
        'Mục đích Web': {
            icon: 'fa-bullseye',
            content: `Mục tiêu cốt lõi của STA là xóa bỏ sự lo lắng của nhà trường và phụ huynh trong mỗi chuyến ngoại khóa.<br><br>
            Chúng tôi cung cấp bộ công cụ giúp:<br>
            • <strong>Chuẩn hóa quy trình:</strong> Từ khâu chuẩn bị, điểm danh đến xử lý sự cố.<br>
            • <strong>Cổng thông tin tập trung:</strong> Kết nối nhà trường - phụ huynh - đơn vị lữ hành.<br>
            • <strong>Cố vấn AI chuyên gia:</strong> Trả lời tức thì, chính xác 100% mọi tình huống rủi ro và quy trình pháp lý.`
        },
        'Chiến lược Tư vấn': {
            icon: 'fa-chess-knight',
            content: `STA áp dụng mô hình <strong>Tư vấn Đa tầng</strong>:<br><br>
            • <strong>Tầng 1: Phân tích Ý định:</strong> Nhận diện chính xác nhu cầu (Pháp lý, An toàn, hay Địa điểm).<br>
            • <strong>Tầng 2: Đối soát Cơ sở dữ liệu:</strong> Sử dụng 18 danh mục quản trị rủi ro chuyên sâu.<br>
            • <strong>Tầng 3: Phản biện Chuyên gia:</strong> Đưa ra các khuyến cáo "Debate" giúp Ban tổ chức nhìn thấy những góc khuất mà các đơn vị lữ hành thường bỏ qua.`
        },
        'Hệ thống AI': {
            icon: 'fa-microchip',
            content: `Chatbot của chúng tôi không chỉ trả lời câu hỏi, nó là một <strong>Hệ thống Chuyên gia (Expert System)</strong>:<br><br>
            • <strong>Dữ liệu chuẩn hóa:</strong> Được xây dựng dựa trên các thông tư, quy định về du lịch học đường của Bộ Giáo dục và Đào tạo.<br>
            • <strong>Chính xác tuyệt đối:</strong> Loại bỏ các câu trả lời lệch lạc, tập trung 100% vào giải pháp thực tế.<br>
            • <strong>Tối ưu Google Search:</strong> Tích hợp các câu hỏi phổ biến nhất mà các nhà quản lý trường học thường tìm kiếm.`
        },
        'Hiệu quả mang lại': {
            icon: 'fa-chart-line',
            content: `Việc ứng dụng SchoolTrip AI mang lại những giá trị đo lường được:<br><br>
            • <strong>Giảm 90% rủi ro thất lạc:</strong> Nhờ quy trình điểm danh 3 lớp và công nghệ định danh.<br>
            • <strong>Tối ưu 70% thời gian lên kế hoạch:</strong> Với các mẫu lịch trình và lưu ý địa điểm có sẵn.<br>
            • <strong>Nâng cao 100% chỉ số tin tưởng:</strong> Phụ huynh hoàn toàn yên tâm khi biết con em được quản lý bởi hệ thống chuyên nghiệp.`
        },
        'Điểm nổi bật': {
            icon: 'fa-star',
            content: `Tại sao nên chọn SchoolTrip AI?<br><br>
            • <strong>Trợ lý STA thông minh:</strong> Nhận diện ý định ngay cả với từ khóa ngắn, tư vấn sâu sắc về "Nên" và "Không nên".<br>
            • <strong>Phân tích Phản biện:</strong> Duy nhất tại STA, chúng tôi đưa ra các rủi ro tiềm ẩn (Debate) giúp Ban tổ chức không chủ quan.<br>
            • <strong>Chuyên sâu giáo dục:</strong> Mỗi địa điểm đều được đánh giá dựa trên giá trị bài học thực tiễn cho học sinh.`
        },
        'Hướng dẫn': {
            icon: 'fa-book-open',
            content: `Khám phá STA qua 3 bước đơn giản:<br><br>
            • <strong>Bước 1:</strong> Truy cập <em>"Vấn đề thường gặp"</em> để nắm chắc 13 quy trình quản trị cốt lõi.<br>
            • <strong>Bước 2:</strong> Xem <em>"Địa điểm du lịch"</em> để chọn nơi đến phù hợp với lứa tuổi và mục tiêu giáo dục.<br>
            • <strong>Bước 3:</strong> Chat trực tiếp với <strong>STA Assistant</strong> để nhận tư vấn riêng biệt cho đoàn của bạn (Ví dụ: "Lưu ý an toàn cho 200 HS đi Củ Chi").`
        },
        'Đối tượng sử dụng': {
            icon: 'fa-user-graduate',
            content: `STA được thiết kế tối ưu cho:<br><br>
            • <strong>Ban Giám hiệu:</strong> Để phê duyệt các phương án tổ chức an toàn, đúng pháp lý.<br>
            • <strong>Giáo viên chủ nhiệm:</strong> Công cụ hỗ trợ quản lý lớp, điểm danh và chăm sóc HS.<br>
            • <strong>Phụ huynh:</strong> Kênh theo dõi lộ trình và yên tâm về sự chuẩn bị của nhà trường.<br>
            • <strong>Các đơn vị lữ hành:</strong> Nâng cấp chất lượng dịch vụ theo chuẩn giáo dục quốc tế.`
        }
    };

    // --- Modal Handling ---
    document.querySelectorAll('.intro-box').forEach(box => {
        box.addEventListener('click', () => {
            const h3 = box.querySelector('h3');
            if (!h3) return;
            const title = h3.innerText;
            const data = introData[title];
            if (data && modalOverlay) {
                modalTitle.innerText = title;
                modalIcon.className = `fas ${data.icon}`;
                modalBody.innerHTML = data.content;
                modalOverlay.classList.add('active');
            }
        });
    });

    if (closeModal) {
        closeModal.addEventListener('click', () => {
            modalOverlay.classList.remove('active');
        });
    }

    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                modalOverlay.classList.remove('active');
            }
        });
    }

    // --- 13 MANAGEMENT ISSUES KNOWLEDGE BASE (STA PHẢN BIỆN CHUYÊN SÂU) ---
    const issuesKB = {
        'quy mô': {
            title: 'QUY MÔ – KHÔNG GIAN – TỔ CHỨC ĐOÀN',
            rootCause: 'Thiếu sót trong khâu khảo sát thực địa (tiền trạm) và dự báo mật độ khách tại điểm đến theo thời điểm.',
            risks: 'Gây ùn tắc cục bộ, mất kiểm soát tầm nhìn, HS dễ bị kích động tâm lý đám đông dẫn đến va chạm vật lý.',
            solution: 'Thiết lập mô hình "Phễu điều phối": Chia đoàn thành các module 40 HS, di chuyển lệch pha 15 phút tại các điểm nút.',
            example: 'Đoàn 500 HS cùng tập trung tại sảnh Dinh Độc Lập gây nhiễu loạn thông tin thuyết minh và khó kiểm soát sĩ số.',
            tech: 'Sử dụng bản đồ số hóa phân luồng di chuyển và cảm biến mật độ (nếu điểm đến hỗ trợ).'
        },
        'thất lạc': {
            title: 'KIỂM SOÁT SĨ SỐ VÀ TRÁNH THẤT LẠC',
            rootCause: 'Hệ thống liên lạc lỏng lẻo giữa các nhóm và sự chủ quan của HS khi di chuyển trong không gian mở.',
            risks: 'HS đi lạc vào khu vực nguy hiểm, bị đối tượng xấu tiếp cận hoặc gây hoảng loạn cho phụ huynh và nhà trường.',
            solution: 'Áp dụng nguyên tắc "Buddy System" (Đôi bạn cùng tiến) + Điểm danh chéo giữa các trưởng nhóm mỗi khi chuyển vị trí.',
            example: 'Học sinh tự ý tách đoàn đi vệ sinh ngay sau khi vừa điểm danh tại xe, dẫn đến xe khởi hành thiếu người.',
            tech: 'Vòng tay định danh QR Code chứa thông tin khẩn cấp và GPS cho các nhóm trưởng.'
        },
        'điểm danh': {
            title: 'ĐIỂM DANH VÀ THEO DÕI HỌC SINH',
            rootCause: 'Phương pháp điểm danh truyền thống (gọi tên) tốn thời gian và dễ sai sót khi đoàn đang ồn ào.',
            risks: 'Bỏ sót học sinh đang gặp sự cố y tế hoặc đang bị kẹt lại tại các khu vực khuất tầm nhìn.',
            solution: 'Quy trình "Sĩ số 3 tầng": Trưởng nhóm báo số -> GV chủ nhiệm đối soát thẻ trực quan -> HDV tổng hợp hệ thống.',
            example: 'HDV vội vàng đếm đầu người trên xe mà không kiểm tra mặt từng HS, dẫn đến đếm nhầm khách vãng lai.',
            tech: 'Phần mềm SchoolTrip Check-in tự động cập nhật sĩ số theo thời gian thực về máy chủ nhà trường.'
        },
        'nhóm': {
            title: 'QUẢN LÝ HỌC SINH THEO NHÓM/LỚP',
            rootCause: 'Cấu trúc quản lý quá phẳng (1 GV quản quá nhiều HS) làm quá tải khả năng giám sát.',
            risks: 'Hình thành các nhóm tự phát khó kiểm soát kỷ luật và dễ xảy ra mâu thuẫn nội bộ đoàn.',
            solution: 'Phân quyền "Ma trận quản lý": Mỗi lớp chia 4 nhóm, mỗi nhóm có 1 nhóm trưởng đại diện liên lạc.',
            example: 'Nhóm học sinh cá biệt tự ý tách đoàn đi khu trò chơi cảm giác mạnh khi chưa được phép của giáo viên.',
            tech: 'Nhóm Zalo/Viber phân cấp để chỉ thị được truyền đạt tức thời đến từng cá nhân.'
        },
        'kỷ luật': {
            title: 'Ý THỨC VÀ KỶ LUẬT',
            rootCause: 'Nội quy chuyến đi chưa được phổ biến thực chất hoặc hình thức thưởng phạt không minh bạch.',
            risks: 'Làm hỏng hình ảnh nhà trường, gây hư hại di tích/vật dụng tại điểm đến, tạo tiền lệ xấu cho các chuyến đi sau.',
            solution: 'Xây dựng "Bộ quy tắc ứng xử Tour": Ký cam kết trước khi đi và áp dụng hình thức "Điểm tích lũy hành vi".',
            example: 'Học sinh viết vẽ bậy lên hiện vật tại di tích lịch sử do giáo viên không nhắc nhở ngay từ đầu.',
            tech: 'Hệ thống đánh giá hành vi trực tuyến để xếp hạng thi đua giữa các lớp sau chuyến đi.'
        },
        'sức khỏe': {
            title: 'AN TOÀN VÀ SỨC KHỎE',
            rootCause: 'Môi trường thay đổi đột ngột (nắng gắt, thức ăn lạ) và thiếu sự chuẩn bị về vật tư y tế khẩn cấp.',
            risks: 'Ngộ độc thực phẩm tập thể, say nắng, chấn thương trong hoạt động vận động mạnh.',
            solution: 'Thiết lập "Trạm y tế di động" luôn đi kèm đoàn và kiểm kê hồ sơ bệnh lý HS trước 1 tuần.',
            example: 'Học sinh bị dị ứng hải sản nhưng Ban tổ chức không kiểm tra danh sách thực đơn trước khi đặt ăn.',
            tech: 'Vòng tay y tế cảnh báo HS có bệnh nền (tim mạch, hen suyễn) để HDV đặc biệt lưu tâm.'
        },
        'tâm lý': {
            title: 'TÂM LÝ HỌC SINH',
            rootCause: 'Áp lực từ lịch trình quá dày hoặc sự cô lập trong môi trường nhóm mới.',
            risks: 'HS bị stress, hoảng loạn khi vào không gian hẹp (như địa đạo) hoặc xảy ra bắt nạt bạn bè.',
            solution: 'Bố trí "Góc tham vấn nhanh": GV chủ nhiệm đóng vai trò quan sát tâm trạng HS để can thiệp kịp thời.',
            example: 'Học sinh bị hội chứng sợ không gian hẹp khi xuống địa đạo Củ Chi dẫn đến ngất xỉu do quá lo sợ.',
            tech: 'Sử dụng các ứng dụng khảo sát tâm trạng nhanh sau mỗi chặng nghỉ để điều chỉnh hoạt động.'
        },
        'liên lạc': {
            title: 'LIÊN LẠC VÀ THÔNG TIN',
            rootCause: 'Nhiễu loạn thông tin giữa các bên (Trường - Công ty - Phụ huynh) do thiếu kênh chính thống.',
            risks: 'Tin đồn thất thiệt lan truyền khi có sự cố nhỏ, gây khủng hoảng truyền thông cho nhà trường.',
            solution: 'Xác lập "Luồng thông tin duy nhất": Một người phát ngôn duy nhất cập nhật tiến độ lên nhóm chung.',
            example: 'Phụ huynh lo lắng thái quá khi không gọi được cho con vì vùng mất sóng, trong khi đoàn vẫn an toàn.',
            tech: 'Tổng đài Hotline STA tự động trả lời các thông tin cơ bản về lịch trình đoàn.'
        },
        'nhân sự': {
            title: 'NHÂN SỰ QUẢN LÝ',
            rootCause: 'Tỷ lệ nhân sự/học sinh không đạt chuẩn hoặc HDV thiếu kỹ năng điều khiển học sinh.',
            risks: 'Nhân sự kiệt sức dẫn đến lơ là quan sát an toàn, hdv không xử lý được các tình huống nổi loạn.',
            solution: 'Đảm bảo tỷ lệ 1:12 cho tiểu học và 1:15 cho trung học. Tập huấn kỹ năng cứu hộ cơ bản cho toàn bộ ekip.',
            example: 'HDV trẻ tuổi bị học sinh THPT "ép" thay đổi lịch trình theo ý thích cá nhân mà không báo cáo trường.',
            tech: 'Hệ thống đánh giá KPI nhân sự điều hành tour dựa trên phản hồi của giáo viên theo thời gian thực.'
        },
        'lịch trình': {
            title: 'THỜI GIAN VÀ LỊCH TRÌNH',
            rootCause: 'Thiết kế lịch trình quá tham lam hoặc không tính đến độ trễ khi di chuyển đoàn đông.',
            risks: 'Học sinh kiệt sức vì di chuyển liên tục, lịch trình bị vỡ dẫn đến bỏ sót các điểm tham quan quan trọng.',
            solution: 'Nguyên tắc "Lịch trình thở": Luôn dành 15% quỹ thời gian làm thời gian dự phòng giữa các điểm.',
            example: 'Đoàn đến điểm tham quan trễ 1 tiếng dẫn đến việc học sinh phải tham quan dưới trời nắng gắt 12h trưa.',
            tech: 'Sử dụng AI tối ưu hóa lộ trình di chuyển dựa trên dữ liệu giao thông thực tế.'
        },
        'phối hợp': {
            title: 'PHỐI HỢP CÁC BÊN',
            rootCause: 'Rào cản về trách nhiệm giữa nhà trường và đơn vị lữ hành trong các điều khoản hợp đồng.',
            risks: 'Đẩy đưa trách nhiệm khi sự cố xảy ra, gây chậm trễ trong công tác cứu hộ hoặc bồi thường.',
            solution: 'Ký kết "Biên bản cam kết trách nhiệm 3 bên" rõ ràng về quyền lợi và nghĩa vụ tối thượng.',
            example: 'Nhà hàng cung cấp suất ăn kém lượng nhưng công ty du lịch và trường không thống nhất được phương án đổi trả.',
            tech: 'Sử dụng hợp đồng điện tử và hệ thống lưu trữ biên bản làm việc số hóa.'
        },
        'pháp lý': {
            title: 'QUY TRÌNH VÀ PHÁP LÝ',
            rootCause: 'Thiếu sự thống nhất trong quy trình phê duyệt nội bộ và sự đồng thuận bằng văn bản từ phía gia đình học sinh.',
            risks: 'Thiếu cơ sở xác nhận trách nhiệm khi có sự cố, gây khó khăn cho GV trong việc quản lý và phối hợp với phụ huynh.',
            solution: 'Thiết lập "Quy trình phê duyệt 5 bước": 1. Trình kế hoạch BGH -> 2. Thông báo phụ huynh -> 3. Thu phiếu đồng ý (cam kết) -> 4. Chốt danh sách bảo hiểm -> 5. Phân công nhiệm vụ GV.',
            example: 'Học sinh tham gia chuyến đi nhưng phụ huynh chưa ký xác nhận đồng ý, dẫn đến tranh chấp trách nhiệm khi HS tự ý tách đoàn.',
            tech: 'Sử dụng Google Forms hoặc App trường học để thu thập phiếu đồng ý và số hóa danh sách cam kết của phụ huynh.'
        },
        'công nghệ': {
            title: 'ỨNG DỤNG CÔNG NGHỆ (GPS, QR, CLOUD)',
            rootCause: 'Sự e ngại đối với các thay đổi kỹ thuật số và quan niệm sai lầm rằng công nghệ là tốn kém hoặc không cần thiết cho công tác quản lý của nhà trường.',
            risks: 'Quản lý thủ công gây lãng phí thời gian, sai sót dữ liệu sĩ số và chậm trễ trong việc ứng cứu khẩn cấp khi học sinh bị lạc hoặc gặp sự cố.',
            solution: 'Triển khai hệ thống mã QR định danh cho từng học sinh, sử dụng bản đồ GPS thực địa và lưu trữ dữ liệu tập trung trên Cloud để truy xuất tức thì.',
            example: 'Thay vì điểm danh thủ công 400 học sinh mất 20 phút, hệ thống quét mã QR chỉ mất 3 phút với độ chính xác 100%.',
            tech: 'Sử dụng nền tảng School Trip AI (STA) tích hợp Dashboard thời gian thực để giám sát toàn bộ hành trình đoàn đông học sinh.'
        },
        'nhà thầu': {
            title: 'CHỌN CÔNG TY DU LỊCH (NHÀ THẦU) UY TÍN',
            rootCause: 'Ham rẻ hoặc chọn theo mối quan hệ cá nhân mà bỏ qua năng lực hồ sơ pháp lý và kinh nghiệm điều hành đoàn học sinh thực tế.',
            risks: 'Dịch vụ kém chất lượng, xe cũ, HDV thiếu kinh nghiệm, thậm chí công ty "ma" gây thất thoát ngân sách và mất an toàn cho HS.',
            solution: 'Quy trình "Thẩm định 4 tiêu chí": 1. Giấy phép lữ hành quốc tế/nội địa -> 2. Hồ sơ năng lực đoàn đông (>500 HS) -> 3. Bảo hiểm ký quỹ -> 4. Phản hồi thực tế từ các trường đã đi.',
            example: 'Nhà trường chọn đơn vị lữ hành giá rẻ dẫn đến việc HDV không biết xử lý tình huống khi HS bị lạc, gây khủng hoảng tâm lý cho phụ huynh.',
            tech: 'Hệ thống đánh giá tín nhiệm nhà thầu dựa trên blockchain và dữ liệu phản hồi tập trung.'
        },
        'vận chuyển': {
            title: 'TIÊU CHUẨN XE VÀ AN TOÀN VẬN CHUYỂN',
            rootCause: 'Sử dụng xe quá đời (cũ), lái xe thiếu kinh nghiệm chạy đoàn đông hoặc không kiểm tra hệ thống an toàn trước khi khởi hành.',
            risks: 'Hỏng hóc dọc đường, lái xe chạy quá tốc độ, cửa thoát hiểm bị kẹt, điều hòa hỏng gây mệt mỏi cho HS.',
            solution: 'Thiết lập "Phiếu kiểm soát xe": Chỉ chấp nhận xe đời từ 2020 trở lên, kiểm tra lốp, phanh, búa thoát hiểm và nồng độ cồn lái xe trước giờ xuất phát.',
            example: 'Xe chở HS bị hỏng điều hòa giữa trời nắng 38 độ, khiến nhiều em bị say nắng ngay khi chưa đến điểm tham quan.',
            tech: 'Giám sát hành trình (Blackbox) kết nối trực tiếp với app quản lý của nhà trường.'
        },
        'thực phẩm': {
            title: 'AN TOÀN VỆ SINH THỰC PHẨM',
            rootCause: 'Chọn nhà hàng không có giấy chứng nhận vệ sinh hoặc thực đơn không phù hợp với lứa tuổi, vùng miền.',
            risks: 'Ngộ độc thực phẩm tập thể, HS bị dị ứng nhưng không có thuốc đối kháng kịp thời.',
            solution: 'Quy trình "Kiểm soát 2 lớp": Kiểm tra giấy tờ nhà hàng trước khi đặt -> Lưu mẫu thức ăn (24h) theo quy định của Bộ Y tế.',
            example: 'Đoàn HS bị đau bụng hàng loạt sau bữa trưa do nhà hàng sử dụng nguồn thực phẩm không tươi sống.',
            tech: 'Truy xuất nguồn gốc thực phẩm qua mã QR trên thực đơn.'
        },
        'bảo hiểm': {
            title: 'BẢO HIỂM DU LỊCH VÀ XỬ LÝ SỰ CỐ',
            rootCause: 'Chỉ mua bảo hiểm hình thức (mức đền bù thấp) hoặc không nắm rõ quy trình yêu cầu bồi thường khi có sự cố xảy ra.',
            risks: 'Gia đình HS phải tự chi trả chi phí điều trị lớn, nhà trường rơi vào thế khó khi xử lý hậu quả tai nạn.',
            solution: 'Nâng mức bảo hiểm từ 20tr lên 100tr/vụ. Công khai số hotline bảo hiểm cho tất cả giáo viên đi đoàn.',
            example: 'Học sinh bị ngã gãy tay nhưng công ty bảo hiểm từ chối bồi thường do hồ sơ hiện trường không đầy đủ.',
            tech: 'Hệ thống khai báo sự cố và yêu cầu bồi thường bảo hiểm ngay lập tức qua ứng dụng số.'
        }
    };

    // --- 12 TOURIST LOCATIONS KNOWLEDGE BASE (DEEP CONTENT) ---
    const locationsKB = {
        'văn miếu': {
            name: 'VĂN MIẾU – QUỐC TỬ GIÁM (HÀ NỘI)',
            address: 'Số 58 phố Quốc Tử Giám, quận Đống Đa, Hà Nội',
            desc: 'Văn Miếu – Quốc Tử Giám được xây dựng năm 1070 dưới triều Lý Thánh Tông. Đây là nơi thờ Khổng Tử và được xem là trường đại học đầu tiên của Việt Nam, biểu tượng cho truyền thống hiếu học và tôn sư trọng đạo.',
            eduValue: `• Tìm hiểu lịch sử giáo dục và hệ thống khoa cử thời phong kiến Việt Nam.\n• Khám phá 82 bia Tiến sĩ (được UNESCO công nhận là Di sản tư liệu thế giới).\n• Giáo dục tinh thần hiếu học và tôn trọng tri thức.\n• Liên hệ với các môn Lịch sử, Ngữ văn, Giáo dục công dân.`,
            activities: 'Học sinh tham quan các khu vực chính như Khuê Văn Các và Nhà Thái Học, nghe thuyết minh về quá trình hình thành Quốc Tử Giám và tham gia hoạt động nhóm tìm hiểu về khoa cử xưa.',
            suitability: '• Học sinh lớp 4–5\n• Học sinh THCS\n• Học sinh THPT',
            schedule: 'Xuất phát buổi sáng, tham quan trong khoảng 2–3 giờ, kết hợp hoạt động nhóm và tổng kết chương trình trước khi trở về trường.',
            cost: `• Người lớn: 70.000 VNĐ/người\n• Học sinh, sinh viên (có thẻ): 35.000 VNĐ/người\n• Trẻ em dưới 16 tuổi: Miễn phí\n*(Giá vé có thể điều chỉnh theo thông báo của BQL)*`,
            deepInfo: `✅ **Nên làm (Should):** \n• Chia nhóm nhỏ (< 20 người) để nghe thuyết minh về lịch sử 82 tấm bia Tiến sĩ.\n• Mặc trang phục lịch sự, trang nghiêm.\n\n❌ **Không nên (Should Not):** \n• Tuyệt đối không xoa đầu rùa hoặc ngồi lên bia di tích.\n• Gây ồn ào tại khu vực Thái Học trang trọng.`,
            debate: '⚠️ **Góc nhìn từ chuyên gia STA:** Không gian ở đây thiên về tĩnh và cổ kính, không phù hợp cho trẻ mầm non hiếu động. Rủi ro lớn nhất là trơn trượt trên gạch cổ khi trời mưa/nồm.'
        },
        'dinh độc lập': {
            name: 'DINH ĐỘC LẬP (TP.HCM)',
            address: 'Số 135 Nam Kỳ Khởi Nghĩa, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh',
            desc: 'Dinh Độc Lập, còn gọi là Hội trường Thống Nhất, nằm ở Quận 1, TP. Hồ Chí Minh. Đây là di tích lịch sử quan trọng ghi dấu sự kiện 30/4/1975 – kết thúc chiến tranh, thống nhất đất nước. Công trình kiến trúc gắn liền với thời kỳ lịch sử hiện đại của Việt Nam.',
            eduValue: `• Tìm hiểu lịch sử Việt Nam giai đoạn kháng chiến chống Mỹ và quá trình thống nhất đất nước.\n• Khám phá vai trò và sinh hoạt của chính quyền Sài Gòn trước 1975.\n• Học về kiến trúc thời hiện đại và không gian văn phòng chính trị của một thời đại.\n• Liên hệ với nội dung môn Lịch sử và Giáo dục công dân.`,
            activities: `• Tham quan các phòng chức năng, nơi làm việc và tiếp khách của các nguyên thủ.\n• Khám phá hầm chỉ huy, phòng họp nội các và nghe thuyết minh chi tiết.\n• Tổ chức hoạt động hỏi đáp dựa trên các sự kiện lịch sử đã diễn ra.`,
            suitability: '• Học sinh THCS\n• Học sinh THPT\n*(Rất phù hợp với nội dung lịch sử thế kỷ 20 và giáo dục truyền thống)*',
            schedule: 'Buổi sáng: Xuất phát đến Dinh -> Tham quan (2–3 giờ) -> Hoạt động nhóm/Hỏi đáp -> Tổng kết, chụp ảnh kỷ niệm trước khi về trường.',
            cost: `• Vé tham quan toàn bộ (Dinh + Nhà trưng bày):\n  - Người lớn (18–59): 80.000 VNĐ\n  - Người cao tuổi & Sinh viên: 40.000 VNĐ\n  - Trẻ em (6–17): 20.000 VNĐ\n• Vé tham quan riêng lẻ:\n  - Người lớn: 40.000 VNĐ\n  - Người cao tuổi & Sinh viên: 20.000 VNĐ\n  - Trẻ em (6–17): 10.000 VNĐ\n*(Cập nhật chính xác từ 01/01/2026)*`,
            deepInfo: `✅ **Nên làm (Should):** \n• Tham quan hệ thống hầm chỉ huy kiên cố và các phòng khánh tiết nghệ thuật.\n• Sử dụng sơ đồ để không bị lạc giữa các hành lang giống nhau.\n\n❌ **Không nên (Should Not):** \n• Tự ý chạm vào hiện vật, rèm cửa hoặc các vật dụng nội thất quý báu.\n• Di chuyển mạnh gây ồn ào tại các khu vực trưng bày quốc tế.`,
            debate: '⚠️ **Góc nhìn từ chuyên gia STA:** Hệ thống hành lang và các lầu của Dinh có thiết kế đối xứng, HS rất dễ bị lạc nhóm nếu đi tách lẻ. Cần bố trí GV chốt chặn tại các điểm giao cầu thang.'
        },
        'củ chi': {
            name: 'ĐỊA ĐẠO CỦ CHI (TP.HCM)',
            address: 'Phú Hiệp, Củ Chi, Thành phố Hồ Chí Minh',
            desc: 'Địa đạo Củ Chi là hệ thống đường hầm dưới lòng đất nằm tại huyện Củ Chi, TP. Hồ Chí Minh. Công trình được xây dựng trong thời kỳ kháng chiến và trở thành biểu tượng tiêu biểu cho chiến tranh du kích của Việt Nam.',
            eduValue: `• Giúp học sinh hiểu rõ chiến tranh Việt Nam và chiến lược du kích.\n• Trải nghiệm mô hình sinh hoạt và chiến đấu dưới lòng đất.\n• Giáo dục tinh thần kiên cường, ý chí vượt khó.\n• Liên hệ trực tiếp với môn Lịch sử và Giáo dục công dân.`,
            activities: `• Tham quan hệ thống địa đạo được mở rộng cho khách tham quan.\n• Nghe thuyết minh về quá trình xây dựng, tìm hiểu hiện vật, bếp Hoàng Cầm, hầm chỉ huy.\n• Tham quan khu tái hiện “Vùng giải phóng” (mua vé riêng).`,
            suitability: '• Học sinh THCS\n• Học sinh THPT',
            schedule: 'Xuất phát buổi sáng -> Tham quan và nghe thuyết minh (2–3 giờ) -> Hoạt động nhóm tìm hiểu lịch sử -> Tổng kết và trở về trường.',
            cost: `• Khách Việt Nam: 35.000 VNĐ/người\n• Học sinh, sinh viên (7–16 tuổi): 17.500 VNĐ (giảm 50% khi có thẻ)\n• Trẻ em dưới 7 tuổi: Miễn phí\n• Vé tham quan khu "Vùng giải phóng": ~65.000 VNĐ\n*(Mở cửa: 7:00 – 17:00 hằng ngày)*`,
            deepInfo: `✅ **Nên làm (Should):** \n• Mặc đồ thể thao, giày bệt/giày vải bám tốt.\n• Trải nghiệm ăn khoai mì tại chỗ để hiểu về thời kỳ kháng chiến.\n\n❌ **Không nên (Should Not):** \n• Xuống lòng hầm nếu có bệnh tim mạch, huyết áp hoặc chứng sợ không gian hẹp.\n• Tách đoàn vào các khu vực rừng rậm chưa được phát quang.`,
            debate: '⚠️ **Góc nhìn từ chuyên gia STA:** Lòng địa đạo dù đã được mở rộng nhưng vẫn thiếu oxy khi đoàn đông cùng xuống. Nguy cơ "Pannic attack" (hoảng loạn) là hoàn toàn có thật với HS thành phố chưa quen không gian tối/hẹp.'
        },
        'huế': {
            name: 'QUẦN THỂ DI TÍCH CỐ ĐÔ HUẾ',
            address: 'Phú Xuân, Huế, Việt Nam',
            desc: 'Cố đô Huế là quần thể di tích lịch sử – văn hóa từng là kinh đô của Việt Nam dưới triều Nguyễn (1802–1945). Nơi đây được UNESCO công nhận là Di sản Văn hoá Thế giới nhờ giá trị kiến trúc và lịch sử đặc biệt.',
            eduValue: `• Tìm hiểu triều Nguyễn và lịch sử Việt Nam thế kỷ XIX–XX.\n• Khám phá kiến trúc cung đình, nghi lễ hoàng gia.\n• Giáo dục ý thức bảo tồn di sản văn hóa dân tộc.\n• Phù hợp tích hợp với các môn Lịch sử, Ngữ văn, GDCD.`,
            activities: `• Tham quan Đại Nội Huế (Hoàng thành, Tử Cấm Thành, Điện Thái Hòa…).\n• Khám phá hệ thống lăng tẩm các vua triều Nguyễn (Minh Mạng, Tự Đức, Khải Định).\n• Nghe thuyết minh lịch sử và tìm hiểu văn hóa cung đình.\n• Chụp ảnh, làm bài thu hoạch sau chuyến đi.`,
            suitability: '• Học sinh THCS\n• Học sinh THPT',
            cost: `• Đại Nội: 200.000 VNĐ (Người lớn), 40.000 VNĐ (Trẻ em 7-12)\n• Các lăng vua: 150.000 VNĐ (Người lớn), 30.000 VNĐ (Trẻ em 7-12)\n• Vé combo (Đại Nội + 3 lăng): ~530.000 VNĐ (Người lớn), ~100.000 VNĐ (Trẻ em)\n*(Cập nhật 2025–2026, Trẻ em < 6 tuổi miễn phí)*`,
            deepInfo: `✅ **Nên làm (Should):** \n• Trang bị mũ nón, nước uống đầy đủ vì diện tích tham quan cực rộng.\n• Chọn 2-3 điểm tiêu biểu (Đại Nội, Lăng Khải Định) thay vì đi hết.\n\n❌ **Không nên (Should Not):** \n• Di chuyển đi bộ quá nhiều dưới nắng gắt dẫn đến say nắng.\n• Ăn uống tự phát tại các hàng quán không đảm bảo bên ngoài các lăng tẩm.`,
            debate: '⚠️ **Góc nhìn từ chuyên gia STA:** Thời tiết Huế nắng mưa thất thường. Diện tích di tích lớn hơn khả năng quản lý của 1 giáo viên phụ trách 1 lớp. Cần thuê thêm hướng dẫn viên bản địa đi kèm mỗi nhóm.'
        },
        'tre việt': {
            name: 'LÀNG DU LỊCH TRE VIỆT (ĐỒNG NAI)',
            address: '25 Phan Văn Đáng, Phú Hữu, Nhơn Trạch, Đồng Nai',
            desc: 'Làng Du Lịch Sinh Thái Tre Việt (Funland) nằm tại Nhơn Trạch, Đồng Nai. Đây là khu du lịch sinh thái sông nước kết hợp vui chơi – dã ngoại – vận động ngoài trời, rất phù hợp cho các chuyến tham quan trong ngày của học sinh.',
            eduValue: `• Tìm hiểu hệ sinh thái sông nước miền Đông Nam Bộ.\n• Rèn luyện kỹ năng vận động và làm việc nhóm thông qua teambuilding.\n• Tăng trải nghiệm thực tế, gắn kết tập thể lớp.\n• Phù hợp tích hợp giáo dục kỹ năng sống và ngoại khóa vận động.`,
            activities: `• Tắm hồ bơi, vui chơi khu nước chuyên biệt.\n• Chèo kayak, thuyền thúng, xe đạp nước trên sông.\n• Tham gia trò chơi dân gian, cầu khỉ, vận động ngoài trời.\n• Tổ chức picnic hoặc thưởng thức buffet theo gói đoàn.`,
            suitability: '• Học sinh Tiểu học\n• Học sinh THCS\n• Học sinh THPT',
            cost: `• Vé cổng: ~50.000 VNĐ\n• Combo cuối tuần (Hồ bơi + Buffet): ~330.000 VNĐ\n• Combo đầy đủ (Gồm trò chơi nước): ~369.000 VNĐ\n• Gói trẻ em: ~165.000 VNĐ\n*(Cập nhật tham khảo 2025–2026)*`,
            deepInfo: `✅ **Nên làm (Should):** \n• Bắt buộc mặc áo phao 100% thời gian khi ở gần hoặc xuống hồ nước.\n• Tổ chức các trò chơi teambuilding vận động dân gian.\n\n❌ **Không nên (Should Not):** \n• Tự ý nhảy xuống bơi lội tại các khu vực không có cứu hộ túc trực.\n• Mang đồ ăn có vỏ sắc nhọn vào khu vực trò chơi dưới nước.`,
            debate: '⚠️ **Góc nhìn từ chuyên gia STA:** Môi trường nước ngọt có rủi ro đuối nước cực nhanh. Sự chủ quan của HS (cho rằng mình biết bơi) là nguy cơ lớn nhất tại đây.'
        },
        'cần giờ': {
            name: 'SINH THÁI CẦN GIỜ (TP.HCM)',
            address: 'Khu dự trữ sinh quyển Cần Giờ, xã Lý Nhơn, huyện Cần Giờ, TP. Hồ Chí Minh',
            desc: 'Cần Giờ là khu vực sinh thái nổi tiếng thuộc TP. Hồ Chí Minh, được biết đến với hệ sinh thái rừng ngập mặn rộng lớn, không khí trong lành và cảnh quan sông nước đặc trưng. Đây là điểm đến phù hợp cho các chuyến tham quan học tập, trải nghiệm thiên nhiên và dã ngoại trong ngày.',
            eduValue: `• Tìm hiểu hệ sinh thái rừng ngập mặn và đa dạng sinh học.\n• Nghiên cứu thực tế về môi trường, biến đổi khí hậu và bảo tồn thiên nhiên.\n• Giáo dục ý thức bảo vệ môi trường cho học sinh.\n• Phù hợp tích hợp với các môn Sinh học, Địa lý, Giáo dục công dân.`,
            activities: `• Tham quan rừng ngập mặn, đi canô, chèo xuồng trong rừng.\n• Tham quan khu bảo tồn động vật (Đảo Khỉ, khu bảo tồn cá sấu...).\n• Tổ chức hoạt động nhóm, dã ngoại ngoài trời gắn liền thiên nhiên.`,
            suitability: '• Học sinh THCS\n• Học sinh THPT',
            cost: `• Vé vào cổng: ~30.000 – 70.000 VNĐ/người.\n• Các dịch vụ canô, tham quan chuyên sâu: Tính phí riêng.\n*(Giờ mở cửa: 07:00 – 17:00 hằng ngày)*`,
            deepInfo: `✅ **Nên làm (Should):** \n• Cất toàn bộ vật dụng cá nhân (mũ, kính, điện thoại) vào túi kéo khóa khi vào Đảo Khỉ.\n• Dùng kem chống muỗi và mặc quần áo dài.\n\n❌ **Không nên (Should Not):** \n• Trêu chọc hoặc ném thức ăn về phía khỉ (chúng sẽ tấn công cướp đồ).\n• Xuống các khu vực đầm lầy trơn trượt không có chỉ dẫn.`,
            debate: '⚠️ **Góc nhìn từ chuyên gia STA:** Khỉ tại đây rất dạn người và hung dữ. Vết cắn của khỉ có thể gây nhiễm trùng nghiêm trọng. Cần giám sát tuyệt đối trẻ nhỏ.'
        },
        'ba vì': {
            name: 'VƯỜN QUỐC GIA BA VÌ (HÀ NỘI)',
            address: 'Xã Tản Lĩnh, huyện Ba Vì, Hà Nội',
            desc: 'Vườn Quốc gia Ba Vì nằm cách trung tâm Hà Nội khoảng 50–60 km về phía tây, với diện tích hơn 10.800 ha. Đây là khu bảo tồn thiên nhiên nổi tiếng với rừng nguyên sinh, khí hậu mát mẻ và hệ động – thực vật phong phú, rất phù hợp cho hoạt động học tập ngoài trời.',
            eduValue: `• Khám phá hệ sinh thái rừng tự nhiên và đa dạng sinh học.\n• Tìm hiểu địa hình miền núi và khí hậu vùng cao phía Bắc.\n• Giáo dục ý thức bảo vệ môi trường.\n• Phù hợp tích hợp với các môn Sinh học, Địa lý.`,
            activities: `• Trekking nhẹ theo các tuyến đường mòn trong rừng.\n• Tham quan đỉnh Vua, đền thờ trên núi Ba Vì.\n• Quan sát thực vật, chụp ảnh học tập thực tế.\n• Tổ chức hoạt động nhóm ngoài trời.`,
            suitability: '• Học sinh THCS\n• Học sinh THPT',
            cost: `• Người lớn: ~60.000 VNĐ\n• HS THCS: ~20.000 VNĐ (có thẻ)\n• HS THPT/Sinh viên: ~10.000 VNĐ (có thẻ)\n*(Giờ mở cửa: 06:00 – 18:00 hằng ngày)*`,
            deepInfo: `✅ **Nên làm (Should):** \n• Chuẩn bị áo khoác nhẹ vì nhiệt độ trên núi thường thấp hơn đồng bằng.\n• Khám phá nhà kính xương rồng và di tích nhà thờ đổ Pháp cổ.\n\n❌ **Không nên (Should Not):** \n• Leo trèo lên các vách đá hoặc di tích đổ nát không an toàn.\n• Đốt lửa trại tại các khu vực có thực vật rậm rạp.`,
            debate: '⚠️ **Góc nhìn từ chuyên gia STA:** Đường lên núi có nhiều khúc cua gấp, xe lớn rất khó di chuyển. Rủi ro lớn nhất là HS bị lạc trong rừng sâu nếu mải mê chụp ảnh tách nhóm.'
        },
        'thảo cầm viên': {
            name: 'THẢO CẦM VIÊN SÀI GÒN',
            address: '2 Nguyễn Bỉnh Khiêm, Phường Sài Gòn, Quận 1, Thành phố Hồ Chí Minh 700000, Việt Nam',
            desc: 'Thảo Cầm Viên Sài Gòn là vườn thú và vườn bách thảo lâu đời nhất Việt Nam, nằm tại Quận 1, TP.HCM. Đây là địa điểm tham quan – học tập ngoài trời kết hợp giữa bảo tồn động vật và không gian cây xanh rộng lớn ngay giữa trung tâm thành phố.',
            eduValue: `• Tìm hiểu đa dạng sinh học và môi trường sống của nhiều loài động vật.\n• Quan sát thực tế các loài thú, chim, bò sát.\n• Giáo dục ý thức bảo vệ động vật và môi trường.\n• Phù hợp tích hợp với các môn Sinh học, Khoa học tự nhiên.`,
            activities: `• Tham quan khu chuồng thú và khu bò sát.\n• Quan sát, ghi chép thông tin về các loài động vật.\n• Tổ chức hoạt động nhóm, học tập ngoài trời.\n• Tham gia các trò chơi trong khuôn viên (tùy nhu cầu).`,
            suitability: '• Học sinh Tiểu học\n• Học sinh THCS\n• Học sinh THPT',
            cost: `• Trẻ em dưới 1m (đi cùng người lớn): Miễn phí\n• Khách cao từ 1m đến dưới 1.3m: 40.000 VNĐ/người\n• Khách cao từ 1.3m trở lên: 60.000 VNĐ/người`,
            deepInfo: `✅ **Nên làm (Should):** \n• Chia nhóm nhỏ để quan sát tập tính của động vật.\n• Dùng bản đồ giấy để HS tập kỹ năng định hướng không gian.\n\n❌ **Không nên (Should Not):** \n• Ném thức ăn lạ vào chuồng thú hoặc trèo qua rào chắn an toàn.\n• Tiếp xúc gần với người lạ vãng lai trong khuôn viên.`,
            debate: '⚠️ **Góc nhìn từ chuyên gia STA:** Là khu vực mở ngay trung tâm nên có nhiều đối tượng lạ. Nguy cơ "người lạ dụ dỗ" (Stranger Danger) cao hơn so với các khu du lịch khép kín.'
        },
        'suối tiên': {
            name: 'KHU DU LỊCH VĂN HÓA SUỐI TIÊN',
            address: '20 XLHN, P. Tăng, Nhơn Phú, Thành phố Hồ Chí Minh, Việt Nam',
            desc: 'Khu Du Lịch Văn Hóa Suối Tiên là tổ hợp vui chơi – giải trí kết hợp yếu tố văn hóa, tâm linh và lịch sử, nằm tại TP. Thủ Đức, TP.HCM. Đây là địa điểm tham quan nổi bật với các công trình mô phỏng truyền thuyết Việt Nam và nhiều trò chơi giải trí hiện đại.',
            eduValue: `• Tìm hiểu truyền thuyết và văn hóa dân gian Việt Nam (Sơn Tinh – Thủy Tinh, Lạc Long Quân – Âu Cơ…).\n• Kết hợp giáo dục lịch sử – văn hóa với hoạt động trải nghiệm thực tế.\n• Rèn luyện kỹ năng sinh hoạt tập thể, hoạt động nhóm.`,
            activities: `• Tham quan các khu chủ đề văn hóa – lịch sử (Đại Cung Lạc Long Quân - Âu Cơ...).\n• Vui chơi trò chơi cảm giác mạnh, trò chơi gia đình.\n• Tham quan biển Tiên Đồng – Ngọc Nữ (tắm biển nhân tạo).\n• Tổ chức hoạt động ngoại khóa, sinh hoạt tập thể.`,
            suitability: '• Học sinh Tiểu học\n• Học sinh THCS\n• Học sinh THPT',
            cost: `• Người lớn: ~120.000 – 150.000 VNĐ\n• Trẻ em: ~60.000 – 100.000 VNĐ\n*(Giá vé trò chơi tính riêng, giờ mở cửa: 08:00 – 17:00)*`,
            deepInfo: `✅ **Nên làm (Should):** \n• Chọn các vị trí tập trung dễ tìm (Cổng Tiên Đồng, Cổng ngõ 1).\n• Đảm bảo HS nắm rõ vị trí trạm y tế của khu du lịch.\n\n❌ **Không nên (Should Not):** \n• Cho HS chơi các trò cảm giác mạnh nếu chưa đạt tiêu chuẩn về chiều cao/sức khỏe.\n• Để HS tiểu học tự do đi lại tại các khu vực hồ nước sâu.`,
            debate: '⚠️ **Góc nhìn từ chuyên gia STA:** Mật độ khách tập trung tại đây vào cuối tuần rất cao. Rủi ro lạc sĩ số là thường xuyên xảy ra nếu không có hệ thống điểm danh 30 phút một lần.'
        },
        'đầm sen': {
            name: 'CÔNG VIÊN VĂN HÓA ĐẦM SEN',
            address: 'Đ. Hòa Bình/3 Đ. Bình Thới, Phường 3, Quận 11, Thành phố Hồ Chí Minh 70000, Việt Nam',
            desc: 'Công viên Văn hóa Đầm Sen là khu vui chơi – giải trí lớn tại Quận 11, TP. Hồ Chí Minh với nhiều trò chơi hiện đại, khu cảnh quan sinh thái và không gian ngoài trời phù hợp cho hoạt động ngoại khóa, vui chơi cuối tuần hoặc tham quan học tập.',
            eduValue: `• Khám phá các trò chơi vận động và hoạt động nhóm ngoài trời.\n• Tìm hiểu về văn hoá giải trí hiện đại và quản lý công viên.\n• Rèn luyện kỹ năng phối hợp trong các trò chơi tập thể.`,
            activities: `• Tham quan, vui chơi các trò chơi cảm giác mạnh và trò chơi gia đình.\n• Dạo quanh cảnh quan hồ nước và các khu vực biểu diễn nghệ thuật.\n• Tổ chức hoạt động vui chơi nhóm, picnic dã ngoại ngoài trời.`,
            suitability: '• Học sinh Tiểu học\n• Học sinh THCS\n• Học sinh THPT',
            cost: `• Vé cổng: ~120.000 VNĐ (Lớn), ~80.000 VNĐ (Trẻ em)\n• Gói tiêu chuẩn: ~260.000 VNĐ (Lớn), ~180.000 VNĐ (Trẻ em)\n• Gói Silver: ~380.000 VNĐ (Lớn), ~240.000 VNĐ (Trẻ em)\n*(Giờ mở cửa: 08:00 – 18:00 hằng ngày)*`,
            deepInfo: `✅ **Nên làm (Should):** \n• Kiểm soát kỹ lối ngăn cách giữa Đầm Sen Khô và Đầm Sen Nước.\n• Tổ chức ăn tập trung tại nhà hàng uy tín bên trong khuôn viên.\n\n❌ **Không nên (Should Not):** \n• Tự ý sử dụng các trò chơi cảm giác mạnh mà không có sự đồng ý của GV.\n• Để HS mang quá nhiều tiền mặt hoặc đồ trang sức khi chơi công viên nước.`,
            debate: '⚠️ **Góc nhìn từ chuyên gia STA:** Hạ tầng một số trò chơi cũ cần được GV khảo sát trước. Rủi ro hỏng hóc thiết bị đột ngột là điều cần đề phòng.'
        },
        'suối mơ': {
            name: 'CÔNG VIÊN SUỐI MƠ (ĐỒNG NAI)',
            address: 'Số 9 Ấp 6, Trà Cổ, Tân Phú, Đồng Nai, Việt Nam',
            desc: 'Công viên Suối Mơ là khu du lịch sinh thái nằm tại huyện Tân Phú, tỉnh Đồng Nai, cách TP. Hồ Chí Minh khoảng 100 km. Với không gian thiên nhiên trong lành, sông nước, hồ rộng và rừng xanh bao quanh, đây là điểm vui chơi – dã ngoại – tham quan lý tưởng cho học sinh và gia đình.',
            eduValue: `• Hiểu về hệ sinh thái sông – rừng và cảnh quan thiên nhiên.\n• Rèn luyện kỹ năng sinh hoạt ngoài trời, teamwork.\n• Thích hợp liên hệ kiến thức Sinh học và Địa lý.`,
            activities: `• Tắm suối, bơi trong hồ nước trong xanh.\n• Tham gia trò chơi dưới nước và các hoạt động chèo thuyền, SUP.\n• Chụp ảnh, picnic, tổ chức nhóm ngoài trời.`,
            suitability: '• Học sinh THCS\n• Học sinh THPT',
            cost: `• Người lớn: ~120.000 VNĐ/người\n• Trẻ em (1m – 1,4m): ~60.000 VNĐ/người\n• Trẻ em dưới 1m: Miễn phí\n*(Lễ/Tết: Người lớn ~140k, Trẻ em ~70k. Giờ mở cửa: 07:00 – 18:00)*`,
            deepInfo: `✅ **Nên làm (Should):** \n• Chuẩn bị đồ bơi và trang phục dự phòng sạch sẽ.\n• Luôn mặc áo phao khi tham gia các trò chơi mặt nước sâu.\n• Mang theo thuốc chống côn trùng vì khu vực có nhiều cây cối.\n\n❌ **Không nên (Should Not):** \n• Tự ý leo trèo lên các vách đá trơn trượt quanh khu hồ nước.\n• Xả rác hoặc đồ ăn thừa xuống dòng suối tự nhiên.`,
            debate: '⚠️ **Góc nhìn từ chuyên gia STA:** Nước suối ở đây chảy tự nhiên nên độ sâu không đồng đều, có nhiều đá ngầm phía dưới. Nguy cơ trượt chân hoặc va đập vào đá khi đùa nghịch dưới nước là rất cao.'
        },
        'đại nam': {
            name: 'KHU DU LỊCH ĐẠI NAM (BÌNH DƯƠNG)',
            address: '1765A Đại lộ Bình Dương, phường Phú An, Thủ Dầu Một, Bình Dương, Việt Nam',
            desc: 'Khu du lịch Đại Nam là quần thể du lịch – giải trí – tâm linh lớn tại TP. Thủ Dầu Một, tỉnh Bình Dương, với diện tích rộng, bao gồm đền chùa, vườn thú, bãi biển nhân tạo, khu trò chơi cảm giác mạnh, khu trình diễn và nhiều hoạt động ngoài trời. Đây là điểm đến phù hợp cho chuyến tham quan học tập kết hợp vui chơi, dã ngoại.',
            eduValue: `• Hiểu về kiến trúc văn hoá – tâm linh trong các khu đền chùa.\n• Quan sát hệ sinh thái động vật tại vườn thú.\n• Rèn kỹ năng quan sát, phản xạ và khám phá trong trò chơi ngoài trời.\n• Phù hợp tích hợp với các môn Lịch sử, Văn hoá, Giáo dục thể chất.`,
            activities: `• Tham quan vườn thú và khu sinh thái.\n• Trải nghiệm các trò chơi nhẹ đến cảm giác mạnh.\n• Nghỉ ngơi, dã ngoại ngoài trời.\n• Tham quan khu tâm linh, đền đài và các chương trình trình diễn.`,
            suitability: '• Học sinh THCS\n• Học sinh THPT\n*(Có thể kết hợp tham quan – nghiên cứu – vui chơi trong ngày)*',
            cost: `• Vé vườn thú: 100.000 VNĐ (Người lớn), 50.000 VNĐ (Trẻ em)\n• Biển nhân tạo: 150.000 VNĐ (Người lớn), 50.000 VNĐ (Trẻ em)\n• Combo trò chơi: 120k (3 trò), 200k (6 trò), 400k (12 trò)\n*(Dưới 1m miễn phí. Giờ mở cửa: 08:00 – 17:00/18:00)*`,
            deepInfo: `✅ **Nên làm (Should):** \n• Thuê xe điện cho đoàn di chuyển để bảo vệ sức khỏe học sinh.\n• Tham quan Kim Điện với thái độ trang nghiêm, yên lặng.\n\n❌ **Không nên (Should Not):** \n• Đi bộ xuyên suốt các khu vì diện tích hàng trăm héc-ta sẽ gây kiệt sức.\n• Để HS tự ý xuống tắm tại biển nhân tạo mà không có sự báo cáo GV.`,
            debate: '⚠️ **Góc nhìn từ chuyên gia STA:** Diện tích quá lớn khiến GV không thể bao quát 100% học sinh bằng mắt thường. Cần hệ thống liên lạc bộ đàm cho các nhóm trưởng.'
        },
        'đà lạt': {
            name: 'THÀNH PHỐ ĐÀ LẠT (LÂM ĐỒNG)',
            address: 'Thành phố Đà Lạt, tỉnh Lâm Đồng, nằm trên cao nguyên Lâm Viên, Việt Nam',
            desc: 'Đà Lạt là một trong những điểm du lịch nổi bật nhất Việt Nam với khí hậu mát mẻ quanh năm, phong cảnh thiên nhiên đa dạng và nhiều điểm check-in đẹp, thu hút học sinh, sinh viên và các nhóm bạn trẻ đến trải nghiệm, học hỏi và thư giãn sau những giờ học căng thẳng. Với nhiều địa điểm miễn phí hoặc có phí rất thấp, Đà Lạt phù hợp với ngân sách tiết kiệm nhưng vẫn rất thú vị và đầy trải nghiệm cả về thiên nhiên, văn hóa và hoạt động ngoài trời.',
            eduValue: `• Kiến thức thực tế về môi trường sinh thái (rừng thông, hồ nước, khí hậu cao nguyên).\n• Tìm hiểu về nông nghiệp công nghệ cao (vườn dâu, trang trại giáo dục).\n• Khám phá lịch sử và văn hóa địa phương thông qua các di sản kiến trúc cổ và chùa chiền.\n• Liên hệ với các môn Sinh học, Địa lý và Lịch sử.`,
            activities: `• Tham quan rừng thông, hồ Tuyền Lâm, Thiền Viện Trúc Lâm.\n• Khám phá kiến trúc độc đáo tại Biệt thự Hằng Nga (Crazy House).\n• Học tập kỹ thuật canh tác nông nghiệp tại các vườn dâu, vườn hoa thực nghiệm.\n• Trải nghiệm trượt thác tại thác Datanla hoặc chinh phục đỉnh Langbiang.`,
            suitability: '• Học sinh THCS\n• Học sinh THPT\n• Sinh viên & Nhóm bạn trẻ yêu thiên nhiên',
            cost: `• **Các điểm miễn phí:** Quảng trường Lâm Viên, Hồ Xuân Hương, Thiền viện Trúc Lâm, chùa Linh Ẩn.\n• **Các điểm có phí (Tham khảo):**\n  - Ga Đà Lạt: ~5.000 VNĐ\n  - Thác Datanla: ~30.000 – 50.000 VNĐ\n  - Núi Langbiang: ~30.000 VNĐ\n  - Crazy House: ~50.000 VNĐ\n  - Vườn hoa Đà Lạt: ~40.000 – 70.000 VNĐ\n  - Clay Tunnel: ~60.000 – 120.000 VNĐ\n  - Thung lũng Tình Yêu: ~250.000 VNĐ\n*(Tổng chi phí tham quan trung bình: 200.000 – 600.000 VNĐ/người/ngày)*`,
            deepInfo: `✅ **Nên làm (Should):** \n• Chuẩn bị quần áo ấm vì nhiệt độ có thể xuống thấp nhanh vào chiều tối.\n• Lên kế hoạch tham quan theo các tuyến đường cùng hướng để tối ưu thời gian.\n\n❌ **Không nên (Should Not):** \n• Tự ý đi sâu vào rừng thông mà không có chỉ dẫn hoặc định vị GPS.\n• Mua sắm tại các gian hàng không niêm yết giá rõ ràng tại chợ đêm để tránh bị "chặt chém".`,
            debate: '⚠️ **Góc nhìn từ chuyên gia STA:** Đà Lạt có địa hình đồi dốc dốc và nhiều khúc cua. Việc quản trị đoàn đông tại các không gian mở như Hồ Xuân Hương hay Quảng trường cần sự tập trung cao độ vì HS rất dễ bị "chìm" trong đám đông du khách vãng lai.'
        },
        'nha trang': {
            name: 'THÀNH PHỐ BIỂN NHA TRANG (KHÁNH HÒA)',
            address: 'Thành phố Nha Trang, tỉnh Khánh Hòa, miền Trung Việt Nam',
            desc: 'Nha Trang là một trong những thành phố biển nổi tiếng nhất Việt Nam với bãi biển dài, nước trong xanh, cát trắng và nhiều đảo nhỏ xung quanh vịnh tuyệt đẹp. Đây là điểm đến phổ biến nhờ sự kết hợp giữa thiên nhiên biển đảo, di tích văn hóa Champa và các trung tâm nghiên cứu khoa học biển hàng đầu.',
            eduValue: `• Bài học thực tế về môi trường biển, sinh thái rạn san hô và bảo tồn thiên nhiên.\n• Tìm hiểu lịch sử văn hóa Champa qua di tích Tháp Bà Po Nagar.\n• Khám phá khoa học đại dương tại Viện Hải Dương học.\n• Liên hệ với các môn Địa lý, Lịch sử và Sinh học.`,
            activities: `• Tham quan Viện Hải Dương học để quan sát các sinh vật biển quý hiếm.\n• Khám phá văn hóa Champa tại Tháp Bà Po Nagar và vãng cảnh chùa Long Sơn.\n• Trải nghiệm đi tàu tham quan vịnh, lặn ngắm san hô (snorkeling) tại các đảo.\n• Các hoạt động vui chơi dã ngoại tại khu vực bãi biển Trần Phú.`,
            suitability: '• Học sinh THCS\n• Học sinh THPT\n• Sinh viên & Nhóm bạn trẻ yêu biển đảo',
            cost: `• **Các điểm miễn phí:** Bãi biển Trần Phú, Chùa Long Sơn, Nhà thờ Núi.\n• **Các điểm có phí (Tham khảo):**\n  - Tháp Bà Po Nagar: ~30.000 VNĐ\n  - Viện Hải Dương học: ~40.000 VNĐ (Có giảm cho HS)\n  - Thác Ba Hồ: ~100.000 – 135.000 VNĐ\n  - Yang Bay: ~150.000 – 200.000 VNĐ\n  - Tour đảo + Snorkeling: 250.000 – 700.000 VNĐ\n*(Tổng chi phí tham quan trung bình: 100.000 – 500.000 VNĐ/người/ngày tùy lộ trình)*`,
            deepInfo: `✅ **Nên làm (Should):** \n• Chuẩn bị kem chống nắng, mũ nón và trang phục bơi đạt chuẩn an toàn.\n• Luôn tuân thủ quy định bảo vệ san hô, không dẫm đạp hoặc bẻ san hô khi lặn.\n\n❌ **Không nên (Should Not):** \n• Tắm biển tại các khu vực có cắm cờ đỏ (vùng nước sâu, sóng dữ).\n• Cho học sinh tự ý đi tour đảo lẻ mà không có sự giám sát của giáo viên và cứu hộ đi kèm.`,
            debate: '⚠️ **Góc nhìn từ chuyên gia STA:** Rủi ro lớn nhất tại Nha Trang là sóng ngầm và đuối nước tại các khu vực đảo xa. Việc quản lý đoàn đông khi di chuyển bằng tàu cao tốc trên vịnh cần quy trình kiểm soát áo phao nghiêm ngặt 100%.'
        },
        'phan thiết': {
            name: 'THÀNH PHỐ BIỂN PHAN THIẾT (BÌNH THUẬN)',
            address: 'Thành phố Phan Thiết, tỉnh Bình Thuận, cách TP.HCM khoảng 200km',
            desc: 'Phan Thiết là điểm du lịch biển nổi tiếng nổi bật với bờ biển dài, cát trắng, đồi cát đỏ – trắng, làng chài truyền thống và nhiều cảnh quan thiên nhiên độc đáo. Đây là sự kết hợp giữa thiên nhiên, văn hoá địa phương và các hoạt động giải trí ngoài trời hiện đại.',
            eduValue: `• Tìm hiểu về địa lý ven biển, hệ sinh thái vùng khô hạn và sa mạc cát.\n• Khám phá văn hóa tộc Chăm qua di tích Tháp Po Shanu.\n• Trải nghiệm nghề biển truyền thống và cách khai thác tài nguyên biển bền vững.\n• Liên hệ với các môn Lịch sử, Địa lý và Kỹ năng sống.`,
            activities: `• Khám phá Đồi cát đỏ, Đồi cát trắng và trải nghiệm trượt cát hoặc đi xe Jeep.\n• Đi bộ dọc Suối Tiên (Fairy Stream) và chiêm bái tượng Phật nằm tại núi Tà Cú.\n• Tham quan tháp Chăm Po Shanu và các khu di tích lịch sử.\n• Trải nghiệm công viên giải trí hiện đại tại NovaWorld Phan Thiết (Dino Park, Safari Cafe...).`,
            suitability: '• Học sinh THCS\n• Học sinh THPT\n• Sinh viên & Nhóm bạn trẻ ưa khám phá',
            cost: `• **Các điểm miễn phí/Rẻ:** Đồi cát đỏ, Đồi cát trắng (~15k), Suối Tiên (~20k), Tháp Po Shanu (~10k).\n• **Các điểm có phí (Tham khảo):**\n  - Núi Tà Cú: Vé vào ~60.000 VNĐ, Cáp treo ~100.000 VNĐ\n  - NovaWorld (Dino Park/Safari): ~120.000 – 140.000 VNĐ/khu\n  - Thuê thiết bị thể thao biển: ~100.000 – 300.000 VNĐ\n*(Tổng chi phí tham quan trung bình: 80.000 – 600.000 VNĐ/người/ngày tùy lựa chọn)*`,
            deepInfo: `✅ **Nên làm (Should):** \n• Mang theo nhiều nước uống và kem chống nắng khi tham quan các đồi cát vì nhiệt độ rất cao.\n• Nên đi đồi cát vào sáng sớm hoặc chiều muộn để tránh say nắng.\n\n❌ **Không nên (Should Not):** \n• Tham gia trượt cát tại các khu vực quá dốc hoặc không có bảo hộ cơ bản.\n• Để học sinh tự ý bơi xa bờ tại các bãi biển công cộng không có lực lượng cứu hộ trực chiến.`,
            debate: '⚠️ **Góc nhìn từ chuyên gia STA:** Phan Thiết có nắng nóng gay gắt quanh năm. Rủi ro sốc nhiệt và mất nước khi tham quan đồi cát lớn là rất cao. GV cần giám sát kỹ việc bổ sung điện giải cho HS trong suốt lịch trình.'
        },
        'vũng tàu': {
            name: 'THÀNH PHỐ BIỂN VŨNG TÀU (BÀ RỊA – VŨNG TÀU)',
            address: 'Thành phố Vũng Tàu, tỉnh Bà Rịa – Vũng Tàu, cách TP.HCM khoảng 120km',
            desc: 'Vũng Tàu là thành phố biển nổi tiếng tại miền Nam, thu hút du khách nhờ bãi biển đẹp, khí hậu ấm áp và nhiều điểm tham quan mang đậm dấu ấn lịch sử, văn hóa và tôn giáo. Đây là điểm đến lý tưởng cho các chuyến đi ngắn ngày kết hợp dã ngoại và tìm hiểu văn hóa địa phương.',
            eduValue: `• Tìm hiểu về địa lý bán đảo và hệ sinh thái ven biển (Bãi Trước, Bãi Sau).\n• Học tập lịch sử qua Bảo tàng Vũ khí cổ và các công trình kiến trúc thời Pháp.\n• Khám phá văn hóa tôn giáo tại Tượng Chúa Kitô và Thích Ca Phật Đài.\n• Liên hệ với các môn Lịch sử, Địa lý và Hoạt động trải nghiệm sáng tạo.`,
            activities: `• Chinh phục núi Nhỏ và tham quan Tượng Chúa Kitô Vua.\n• Khám phá bộ sưu tập quân phục tại Bảo tàng Vũ khí Robert Taylor.\n• Vãng cảnh Thích Ca Phật Đài và Thắng cảnh Mũi Nghinh Phong.\n• Trải nghiệm cáp treo và vui chơi tại Khu du lịch Hồ Mây Park.`,
            suitability: '• Học sinh THCS\n• Học sinh THPT\n• Nhóm gia đình & bạn trẻ',
            cost: `• **Các điểm miễn phí:** Bãi biển, Mũi Nghinh Phong, Thích Ca Phật Đài, Niết Bàn Tịnh Xá.\n• **Các điểm có phí (Tham khảo):**\n  - Bảo tàng Vũ khí Robert Taylor: ~100.000 VNĐ\n  - Công viên Thỏ Trắng: ~50.000 VNĐ\n  - Hồ Mây Park (Cáp treo + Trò chơi): ~200.000 – 500.000 VNĐ\n*(Tổng chi phí tham quan trung bình: 50.000 – 600.000 VNĐ/người/ngày tùy lộ trình)*`,
            deepInfo: `✅ **Nên làm (Should):** \n• Khuyến khích HS leo bộ lên Tượng Chúa Kitô vào sáng sớm để rèn luyện thể lực và tránh nắng.\n• Luôn kiểm tra dự báo thời tiết và tình trạng sóng biển trước khi tổ chức hoạt động tắm biển.\n\n❌ **Không nên (Should Not):** \n• Tắm biển tại các khu vực có nhiều đá ngầm hoặc dòng chảy xiết (đặc biệt khu vực Bãi Trước).\n• Để HS tự ý di chuyển lên các đỉnh núi mà không có giáo viên đi kèm vì đường dốc và đông khách du lịch.`,
            debate: '⚠️ **Góc nhìn từ chuyên gia STA:** Vũng Tàu là điểm đến rất gần và đông đúc vào cuối tuần. Rủi ro lớn nhất là thất lạc HS trong đám dông tại Bãi Sau hoặc tại các khu vui chơi quy mô lớn như Hồ Mây. Cần thẻ định danh QR cho tất cả HS khi đến đây.'
        },
        'núi bà đen': {
            name: 'KHU DU LỊCH NÚI BÀ ĐEN (TÂY NINH)',
            address: 'Xã Thạnh Tân, thành phố Tây Ninh, tỉnh Tây Ninh',
            desc: 'Núi Bà Đen là ngọn núi cao nhất khu vực Nam Bộ (986m), biểu tượng của Tây Ninh với quần thể chùa Bà, chùa Hang, tượng Phật và hệ thống cáp treo hiện đại. Đây là điểm đến kết hợp hoàn hảo giữa du lịch tâm linh, khám phá thiên nhiên và hoạt động dã ngoại thực tế.',
            eduValue: `• Tìm hiểu về địa hình núi đá, khí hậu đặc trưng vùng Đông Nam Bộ.\n• Khám phá tín ngưỡng tôn giáo và các lễ hội dân gian tại quần thể chùa Bà.\n• Rèn luyện kỹ năng trekking, làm việc nhóm và quan sát thiên nhiên mỏ.\n• Liên hệ với các môn Địa lý, Lịch sử và Kỹ năng sinh tồn.`,
            activities: `• Trải nghiệm hệ thống cáp treo Sun World hiện đại ngắm toàn cảnh Tây Ninh.\n• Tham quan quần thể Chùa Bà, Chùa Hang và Tượng Phật Bà Tây Bổ Đà Sơn.\n• Trekking leo núi rèn luyện thể lực qua các cung đường rừng đá.\n• Khám phá các khu vườn cảnh và không gian văn hóa trên đỉnh núi.`,
            suitability: '• Học sinh THCS\n• Học sinh THPT\n• Nhóm bạn trẻ yêu thích leo núi & thiên nhiên',
            cost: `• **Vé vào cổng:** ~10.000 VNĐ\n• **Cáp treo (Tuyến Chùa Hang):** ~250.000 VNĐ (Khứ hồi)\n• **Cáp treo (Tuyến Vân Sơn - Đỉnh):** ~400.000 VNĐ (Khứ hồi)\n• **Combo 2 tuyến:** ~600.000 VNĐ\n*(Tổng chi phí dự kiến: 260.000 – 800.000 VNĐ/người tùy dịch vụ)*`,
            deepInfo: `✅ **Nên làm (Should):** \n• Chọn trang phục gọn gàng, giày thể thao có độ bám tốt nếu có ý định leo bộ.\n• Mang theo áo khoác nhẹ vì nhiệt độ trên đỉnh núi có thể thấp hơn chân núi đáng kể.\n\n❌ **Không nên (Should Not):** \n• Tự ý tách đoàn leo núi theo các đường mòn lạ không có dấu chỉ dẫn.\n• Xả rác hoặc làm hư hại đến cảnh quan thiên nhiên và các khu vực tâm linh tôn nghiêm.`,
            debate: '⚠️ **Góc nhìn từ chuyên gia STA:** Độ cao và độ dốc của Núi Bà Đen là một thách thức lớn về thể lực đối với HS. Việc tổ chức leo bộ cần có sự đánh giá sức khỏe nghiêm ngặt. Nếu đi cáp treo, cần lưu ý rủi ro say độ cao nhẹ ở một số HS nhạy cảm.'
        },
        'vinwonders phú quốc': {
            name: 'CÔNG VIÊN CHỦ ĐỀ VINWONDERS PHÚ QUỐC',
            address: 'Bãi Dài, xã Gành Dầu, thành phố Phú Quốc, tỉnh Kiên Giang',
            desc: 'VinWonders Phú Quốc là công viên chủ đề quy mô lớn nhất Việt Nam, gồm nhiều phân khu trò chơi trong nhà – ngoài trời, thủy cung, khu văn hoá – giải trí và các chương trình biểu diễn hoành tráng. Đây là điểm đến kết hợp hoàn hảo giữa giải trí, học tập thực tế và trải nghiệm sinh thái biển.',
            eduValue: `• **Khoa học - Sinh học:** Tìm hiểu đa dạng sinh học biển, hệ sinh thái đại dương và tập tính các loài sinh vật tại Thủy cung.\n• **Địa lý - Môi trường:** Hiểu về địa lý đảo, khí hậu biển và tác động của hoạt động du lịch đến môi trường.\n• **Kỹ năng sống:** Rèn luyện tinh thần đồng đội, kỷ luật và khả năng xử lý tình huống qua các trò chơi vận động.\n• **Định hướng nghề nghiệp:** Quan sát mô hình vận hành chuyên nghiệp của ngành du lịch, dịch vụ và tổ chức sự kiện.`,
            activities: `• Khám phá Thủy cung và quan sát các buổi biểu diễn cho cá ăn.\n• Trải nghiệm hệ thống trò chơi cảm giác mạnh và công viên nước hiện đại.\n• Xem các show biểu diễn nghệ thuật đa phương tiện tầm cỡ quốc tế.\n• Tham gia các hoạt động sinh hoạt tập thể và ghi chép nhật ký trải nghiệm.`,
            suitability: '• Học sinh THCS\n• Học sinh THPT\n• Nhóm du lịch học đường ngoại khóa',
            cost: `• **Vé VinWonders:** ~880.000 VNĐ (Người lớn), ~660.000 VNĐ (Trẻ em).\n• **Combo VinWonders + Safari:** ~1.200.000 VNĐ (Người lớn).\n*(Trẻ em dưới 1m: Miễn phí)*`,
            deepInfo: `✅ **Nên làm (Should):** \n• Lên kế hoạch tham quan các phân khu theo lịch trình biểu diễn để không bỏ lỡ các show chính.\n• Khuyến khích HS ghi chép lại các loài sinh vật biển tại Thủy cung để phục vụ bài thu hoạch sinh học.\n\n❌ **Không nên (Should Not):** \n• Tham gia các trò chơi cảm giác mạnh ngay sau khi ăn no hoặc khi có tiền sử bệnh tim mạch.\n• Tự ý tách đoàn di chuyển sang các khu vực rừng lân cận mà không có sự báo cáo giáo viên.`,
            debate: '⚠️ **Góc nhìn từ chuyên gia STA:** VinWonders Phú Quốc có quy mô cực lớn và rất đông hành khách. Rủi ro lớn nhất là học sinh bị phân tâm bởi các trò chơi hấp dẫn dẫn đến chậm lịch trình hoặc thất lạc. Cần quy định điểm tập trung cố định mỗi 2 giờ.'
        },
        'ba na hills': {
            name: 'SUN WORLD BA NA HILLS (ĐÀ NẴNG)',
            address: 'Thôn An Sơn, xã Hòa Ninh, huyện Hòa Vang, thành phố Đà Nẵng',
            desc: 'Sun World Ba Na Hills là một trong những khu du lịch hàng đầu Việt Nam, nổi bật với khí hậu mát mẻ, lối kiến trúc làng Pháp cổ kính và Cầu Vàng biểu tượng. Đây là điểm đến mang lại trải nghiệm độc đáo về thiên nhiên, văn hóa và giải trí cao cấp cho học sinh, sinh viên.',
            eduValue: `• **Địa lý - Môi trường:** Trải nghiệm "bốn mùa trong một ngày" và tìm hiểu về hệ sinh thái vùng núi cao.\n• **Lịch sử - Văn hóa:** Khám phá kiến trúc châu Âu thời Pháp thuộc qua Làng Pháp và Hầm rượu Debay.\n• **Kỹ thuật - Công nghệ:** Tìm hiểu về hệ thống cáp treo đạt nhiều kỷ lục thế giới và quy trình vận hành khu phức hợp núi cao.\n• **Kỹ năng sống:** Rèn luyện kỹ năng tự quản lý lộ trình và làm việc nhóm tại không gian du lịch quy mô lớn.`,
            activities: `• Trải nghiệm hệ thống cáp treo Guinness ngắm toàn cảnh núi rừng Bà Nà.\n• Check-in tại Cầu Vàng - biểu tượng đôi bàn tay khổng lồ.\n• Tham quan Làng Pháp cổ kính, vườn hoa Le Jardin D’Amour và Fantasy Park.\n• Thưởng thức các show biểu diễn nghệ thuật đường phố và lễ hội theo mùa.`,
            suitability: '• Học sinh THCS\n• Học sinh THPT\n• Đoàn ngoại khóa trường học & CLB',
            cost: `• **Giá vé cáp treo (Ngoại tỉnh):** Người lớn ~1.000.000 VNĐ, Trẻ em (1m-1.4m) ~800.000 VNĐ.\n• **Combo Cáp treo + Buffet trưa:** Người lớn ~1.300.000 VNĐ, Trẻ em ~1.000.000 VNĐ.\n• **Combo Bà Nà by Night:** Người lớn ~1.050.000 VNĐ, Trẻ em ~850.000 VNĐ.\n*(Trẻ em dưới 1m: Miễn phí)*`,
            deepInfo: `✅ **Nên làm (Should):** \n• Mang theo áo khoác mỏng hoặc khăn quàng vì nhiệt độ trên đỉnh núi có thể thay đổi đột ngột và lạnh hơn dưới chân núi.\n• Ưu tiên đi sớm để kịp chụp ảnh tại Cầu Vàng trước khi lượng khách đổ về quá đông.\n\n❌ **Không nên (Should Not):** \n• Di chuyển ra khỏi các khu vực rào chắn an toàn hoặc lối đi dành cho khách tham quan.\n• Ăn mặc quá mỏng hoặc không đủ ấm khi ở lại tham gia các hoạt động về đêm trên đỉnh núi.`,
            debate: '⚠️ **Góc nhìn từ chuyên gia STA:** Ba Na Hills có chi phí vé ở mức cao (Top-tier). Để tối ưu chi phí cho đoàn học sinh, nhà trường nên chọn gói Combo Buffet để đảm bảo dinh dưỡng và sức khỏe cho HS suốt cả ngày dài thay vì ăn lẻ tại các quầy dịch vụ.'
        },
        'núi thần tài': {
            name: 'CÔNG VIÊN SUỐI KHOÁNG NÓNG NÚI THẦN TÀI (ĐÀ NẴNG)',
            address: 'Thôn Phú Túc, xã Hòa Phú, huyện Hòa Vang, thành phố Đà Nẵng',
            desc: 'Núi Thần Tài Hot Springs Park là khu du lịch suối khoáng nóng thiên nhiên độc đáo nằm trong khu bảo tồn thiên nhiên Bà Nà – Núi Chúa. Nơi đây nổi tiếng với các dịch vụ chăm sóc sức khỏe, vui chơi giải trí nước quy mô lớn và không gian thiên nhiên hùng vĩ.',
            eduValue: `• **Địa lý - Sinh thái:** Tìm hiểu về nguồn nước khoáng nóng tự nhiên và đặc trưng địa hình vùng núi Chúa.\n• **Sức khỏe:** Học hỏi về tác dụng của các khoáng chất trong nước nóng đối với sức khỏe con người qua các liệu pháp tắm Onsen, tắm bùn.\n• **Môi trường:** Nâng cao ý thức bảo vệ nguồn nước sạch và bảo tồn hệ sinh thái rừng núi.`,
            activities: `• Trải nghiệm ngâm tắm suối khoáng nóng tự nhiên và tắm bùn khoáng chăm sóc da.\n• Vui chơi thỏa thích tại Công viên nước khổng lồ với các trò chơi máng trượt hiện đại.\n• Tham quan đường hoa phong lan, Đền Thần Tài và khu vực luộc trứng trường thọ.\n• Trải nghiệm văn hóa tắm Onsen phong cách Nhật Bản độc đáo.`,
            suitability: '• Học sinh THCS\n• Học sinh THPT\n• Sinh viên & Các đoàn ngoại khóa chăm sóc sức khỏe',
            cost: `• **Vé phổ thông:** ~450.000 – 490.000 VNĐ/người.\n• **Combo Vé + Buffet:** ~700.000 – 850.000 VNĐ.\n• **Gói dịch vụ cao cấp (Tắm bùn/Onsen):** ~900.000 – 1.200.000 VNĐ.\n*(Mức phí phù hợp cho chuyến đi trải nghiệm chất lượng cao trong ngày)*`,
            deepInfo: `✅ **Nên làm (Should):** \n• Chuẩn bị trang phục bơi đạt chuẩn và khăn tắm cá nhân khi tham gia các hoạt động nước.\n• Khuyến khích HS tham gia khu vực "luộc trứng trường thọ" để hiểu thêm về sức nóng tự nhiên của mạch nước khoáng.\n\n❌ **Không nên (Should Not):** \n• Ngâm mình quá lâu trong nước khoáng nóng (quá 20 phút/lần) để tránh tình trạng say khoáng hoặc tụt huyết áp.\n• HS có tiền sử bệnh tim mạch cần sự đồng ý của y tế đoàn trước khi sử dụng các dịch vụ tắm nóng/tắm bùn.`,
            debate: '⚠️ **Góc nhìn từ chuyên gia STA:** Núi Thần Tài là một điểm đến tuyệt vời để cân bằng giữa vui chơi và sức khỏe. Tuy nhiên, rủi ro về nhiệt độ (nóng/lạnh đột ngột) là yếu tố cần kiểm soát chặt chẽ. Giáo viên cần yêu cầu HS nghỉ ngơi ít nhất 15 phút sau khi vui chơi mạnh trước khi xuống tắm khoáng nóng.'
        },
        'phong nha': {
            name: 'VƯỜN QUỐC GIA PHONG NHA – KẺ BÀNG (QUẢNG BÌNH)',
            address: 'Huyện Bố Trạch, tỉnh Quảng Bình, cách TP. Đồng Hới khoảng 50km',
            desc: 'Phong Nha – Kẻ Bàng là Di sản Thiên nhiên Thế giới nổi tiếng với hệ thống hang động kỳ vĩ, sông ngầm và cảnh quan núi đá vôi độc đáo. Đây là điểm đến lý tưởng để học sinh khám phá địa chất, sinh học và vẻ đẹp nguyên sơ của thiên nhiên.',
            eduValue: `• **Địa chất:** Quan sát quá trình phong hóa, kiến tạo thạch nhũ và hệ thống sông ngầm thực tế.\n• **Sinh học:** Tìm hiểu đa dạng sinh vật rừng nhiệt đới và các loài động vật đặc hữu trong hang động.\n• **Bảo tồn:** Nâng cao ý thức bảo vệ di sản thiên nhiên và môi trường bền vững.`,
            activities: `• Tham quan Hang Phong Nha bằng thuyền dọc sông Son ngắm thạch nhũ.\n• Khám phá Động Thiên Đường - "Hoàng cung trong lòng đất" với hệ thống cầu gỗ dài.\n• Trải nghiệm Zipline, tắm bùn và chèo Kayak tại Hang Tối & Sông Chày.\n• Thư giãn và bơi lội tại Suối Nước Moọc thơ mộng.`,
            suitability: '• Học sinh THCS\n• Học sinh THPT\n• Nhóm yêu thích khám phá thiên nhiên & hang động',
            cost: `• **Hang Phong Nha:** Vé ~150.000 VNĐ + Thuyền (~550.000 VNĐ/thuyền chia theo đoàn).\n• **Động Thiên Đường:** Vé ~250.000 VNĐ + Xe điện (~60.000 VNĐ).\n• **Hang Tối & Sông Chày:** Gói trải nghiệm ~270.000 – 450.000 VNĐ.\n• **Suối Moọc:** Vé ~80.000 – 180.000 VNĐ.\n*(Lưu ý: Có giá ưu đãi cho đoàn học sinh khi liên hệ trước)*`,
            deepInfo: `✅ **Nên làm (Should):** \n• Mang theo đồ bơi và quần áo dự phòng nếu có kế hoạch đi Suối Moọc hoặc Hang Tối.\n• Sử dụng giày có độ bám tốt vì một số khu vực trong hang có thể trơn trượt.\n\n❌ **Không nên (Should Not):** \n• Tự ý chạm vào hoặc bẻ thạch nhũ trong hang vì sẽ làm hỏng quá trình kiến tạo tự nhiên hàng triệu năm.\n• Học sinh có hội chứng sợ không gian kín hoặc sợ tối cần được giáo viên lưu ý đặc biệt trước khi vào hang sâu.`,
            debate: '⚠️ **Góc nhìn từ chuyên gia STA:** Phong Nha có địa hình hang động phức tạp và di chuyển bằng thuyền. Rủi ro trượt ngã hoặc rơi xuống nước cần được quản trị bằng việc mặc áo phao 100% khi đi thuyền và đi giày chống trượt chuyên dụng.'
        },
        'tràng an': {
            name: 'QUẦN THỂ DANH THẮNG TRÀNG AN (NINH BÌNH)',
            address: 'Xã Trường Yên, huyện Hoa Lư, tỉnh Ninh Bình, Việt Nam',
            desc: 'Tràng An là Di sản Văn hóa và Thiên nhiên Thế giới được UNESCO công nhận, nổi bật với hệ thống núi đá vôi kỳ vĩ và các hang động xuyên thủy tuyệt đẹp. Đây là địa điểm giáo dục lý tưởng về địa chất, lịch sử cố đô và bảo tồn di sản.',
            eduValue: `• **Địa chất:** Tìm hiểu về địa hình Karst đặc trưng và quá trình hình thành hang động qua hàng triệu năm.\n• **Lịch sử - Văn hóa:** Khám phá dấu ấn cố đô Hoa Lư gắn liền với các triều đại Đinh, Tiền Lê.\n• **Bảo tồn:** Nâng cao nhận thức về việc bảo vệ di sản thế giới và phát triển du lịch bền vững.`,
            activities: `• Trải nghiệm đi thuyền tham quan các hang động nước tiêu biểu (Hang Sáng, Hang Tối, Hang Nấu Rượu).\n• Tham quan các đền, phủ cổ kính nằm sâu trong quần thể danh thắng.\n• Tích hợp học tập lịch sử tại Cố đô Hoa Lư và trải nghiệm leo núi tại Hang Múa.\n• Quan sát hệ sinh thái ngập nước và chụp ảnh tư liệu thực tế.`,
            suitability: '• Học sinh THCS\n• Học sinh THPT\n• Đoàn ngoại khóa tìm hiểu Di sản & Lịch sử',
            cost: `• **Vé tham quan (Bao gồm thuyền):** ~250.000 VNĐ/người.\n• **Cố đô Hoa Lư:** ~20.000 VNĐ.\n• **Hang Múa:** ~100.000 VNĐ.\n*(Tổng chi phí dự kiến: 500.000 – 1.200.000 VNĐ/người cho lịch trình trọn gói trong ngày)*`,
            deepInfo: `✅ **Nên làm (Should):** \n• Luôn mặc áo phao và ngồi cân bằng khi di chuyển trên thuyền tham quan.\n• Chuẩn bị mũ nón và kem chống nắng vì phần lớn thời gian tham quan là ở ngoài trời trên sông.\n\n❌ **Không nên (Should Not):** \n• Tự ý đứng dậy hoặc nghiêng người trên thuyền để chụp ảnh gây rủi ro lật thuyền.\n• Khua tay dưới nước tại các khu vực bảo tồn nghiêm ngặt để tránh làm xáo trộn hệ sinh thái thủy sinh.`,
            debate: '⚠️ **Góc nhìn từ chuyên gia STA:** Tràng An cực kỳ an toàn cho học sinh nhờ hệ thống quản lý thuyền chuyên nghiệp. Tuy nhiên, giáo viên cần lưu ý quản lý đoàn tại các điểm dừng chân trên cạn (đền, phủ) vì lượng khách du lịch thường rất đông, dễ dẫn đến thất lạc thành viên.'
        },
        'hồ tràm': {
            name: 'KHU DU LỊCH BIỂN HỒ TRÀM (BÀ RỊA – VŨNG TÀU)',
            address: 'Xã Phước Thuận, huyện Xuyên Mộc, tỉnh Bà Rịa – Vũng Tàu',
            desc: 'Hồ Tràm là dải bờ biển hoang sơ, yên bình nằm giữa Long Hải và Bình Châu. Với không khí trong lành và cảnh quan thiên nhiên còn giữ được nét nguyên sơ, đây là địa điểm lý tưởng cho các hoạt động dã ngoại, cắm trại và học tập ngoại khóa tập thể.',
            eduValue: `• **Địa lý - Sinh thái:** Tìm hiểu đặc điểm vùng ven biển và hệ sinh thái rừng nguyên sinh Bình Châu - Phước Bửu.\n• **Môi trường:** Nhận thức về tầm quan trọng của việc bảo vệ tài nguyên biển và rừng đặc dụng.\n• **Kỹ năng sống:** Phát triển kỹ năng sinh hoạt nhóm, cắm trại và các hoạt động team building ngoài trời.`,
            activities: `• Tổ chức các hoạt động dọn dẹp bãi biển (Service Learning) và trò chơi vận động tập thể.\n• Khám phá thiên nhiên tại Khu bảo tồn thiên nhiên Bình Châu – Phước Bửu.\n• Trải nghiệm tắm suối khoáng nóng và luộc trứng tại suối nước nóng Bình Châu.\n• Tìm hiểu đời sống và nghề đánh bắt thủ công của ngư dân địa phương.`,
            suitability: '• Học sinh THCS\n• Học sinh THPT\n• Sinh viên & Các đoàn dã ngoại tập thể',
            cost: `• **Bãi biển công cộng:** Miễn phí.\n• **Rừng Bình Châu - Phước Bửu:** ~20.000 VNĐ.\n• **Suối khoáng Bình Châu:** ~100.000 – 200.000 VNĐ (Vé vào cổng).\n*(Tổng chi phí dự kiến: 500.000 – 1.000.000 VNĐ/người cho chuyến đi tập thể tự túc)*`,
            deepInfo: `✅ **Nên làm (Should):** \n• Chuẩn bị bạt ngồi, đồ ăn và nước uống nếu tổ chức dã ngoại tại khu vực bãi biển công cộng.\n• Luôn dọn dẹp sạch rác thải sau khi kết thúc buổi dã ngoại để bảo vệ môi trường biển.\n\n❌ **Không nên (Should Not):** \n• Tắm biển tại những khu vực có bảng cảnh báo nước sâu hoặc không có nhân viên cứu hộ trực bãi.\n• Tự ý đi sâu vào rừng nguyên sinh mà không có sự dẫn dắt của hướng dẫn viên hoặc giáo viên quản lý.`,
            debate: '⚠️ **Góc nhìn từ chuyên gia STA:** Hồ Tràm có nhiều bãi biển khá hoang sơ và sóng có thể lớn tùy thời điểm. Khi tổ chức hoạt động team building dưới nước, bắt buộc phải có đội cứu hộ riêng của đoàn hoặc thuê dịch vụ giám sát từ các resort lân cận.'
        },
        'đảo bình ba': {
            name: 'ĐẢO BÌNH BA (CAM RANH - KHÁNH HÒA)',
            address: 'Xã Cam Bình, thành phố Cam Ranh, tỉnh Khánh Hòa',
            desc: 'Đảo Bình Ba là một hòn đảo nhỏ tuyệt đẹp thuộc vịnh Cam Ranh, nổi tiếng với danh xưng "Đảo Tôm Hùm". Với làn nước trong xanh, bãi cát trắng và nhịp sống thanh bình của ngư dân, đây là điểm đến tuyệt vời để học sinh trải nghiệm thực tế về biển đảo và văn hóa địa phương.',
            eduValue: `• **Địa lý:** Khám phá đặc điểm tự nhiên của hải đảo và hệ sinh thái rạn san hô ven bờ.\n• **Văn hóa - Xã hội:** Tìm hiểu đời sống, phong tục và các ngành nghề nuôi trồng thủy hải sản của ngư dân.\n• **Môi trường:** Nâng cao nhận thức bảo tồn biển và ý thức trách nhiệm khi tham quan các khu vực hải đảo nhạy cảm.`,
            activities: `• Thỏa thích tắm biển tại Bãi Nồm, Bãi Chướng hoặc Bãi Nhà Cũ.\n• Tham gia lặn ngắm san hô (snorkeling) và tham quan các lồng bè nuôi tôm hùm.\n• Khám phá quanh đảo bằng xe điện hoặc xe máy cùng hướng dẫn viên địa phương.\n• Trải nghiệm học tập về các loại hải sản đặc hữu trực tiếp tại chợ đảo.`,
            suitability: '• Học sinh THCS\n• Học sinh THPT\n• Nhóm bạn trẻ yêu thích khám phá biển đảo dã ngoại',
            cost: `• **Tàu ra đảo:** ~50.000 – 70.000 VNĐ (Khứ hồi).\n• **Lưu trú homestay:** ~200.000 – 400.000 VNĐ/người.\n• **Hải sản & Ăn uống:** ~400.000 – 700.000 VNĐ.\n*(Tổng chi phí dự kiến: 600.000 – 1.200.000 VNĐ/người cho lịch trình 2 ngày 1 đêm)*`,
            deepInfo: `✅ **Nên làm (Should):** \n• Chuẩn bị giấy tờ tùy thân (CCCD) đầy đủ vì đây là hòn đảo có quy định nghiêm ngặt về an ninh quốc phòng.\n• Nên mang theo kem chống nắng, mũ rộng vành và trang trọng phù hợp du lịch biển đảo.\n\n❌ **Không nên (Should Not):** \n• Tham gia vào hoạt động di chuyển trên biển nếu thời tiết xấu hoặc có cảnh báo dông lốc từ cảng vụ.\n• Tự ý giẫm đạp hoặc thu hoạch san hô trái quy định khi tham gia hoạt động lặn ngắm.`,
            debate: '⚠️ **Góc nhìn từ chuyên gia STA:** Bình Ba là đảo trọng yếu về quân sự. Việc tổ chức đoàn lớn học sinh cần liên hệ trước với chính quyền xã Cam Bình và cảng vụ. Rủi ro chính là việc di chuyển bằng tàu/ghe qua lại giữa các bãi tắm, cần quản lý sỹ số cực kỳ chặt chẽ khi lên/xuống tàu.'
        }
    };

    // --- KEYWORD MAPPER (Handling 1-3 word queries) ---
    const keywordMapper = {
        // 1. QUY MÔ - KHÔNG GIAN
        'quy mô': 'quy mô', 'không gian': 'quy mô', 'tổ chức đoàn': 'quy mô', 'đông': 'quy mô', 'số lượng': 'quy mô', 'diện tích': 'quy mô', 'chỗ': 'quy mô', 'sức chứa': 'quy mô', 'mật độ': 'quy mô', 'ùn tắc': 'quy mô', 'lộn xộn': 'quy mô', 'quá đông': 'quy mô',

        // 2 & 3 & 4. QUẢN LÝ HỌC SINH (Gộp linh hoạt theo yêu cầu)
        'quản lý học sinh': 'nhóm', 'quản lí học sinh': 'nhóm', 'quản lý theo nhóm': 'nhóm', 'chia nhóm': 'nhóm', 'quản lý đoàn': 'nhóm', 'kiểm soát học sinh': 'nhóm', 'theo dõi học sinh': 'nhóm', 'quản lý danh sách': 'nhóm', 'điểm danh': 'nhóm', 'sĩ số': 'nhóm', 'kiểm diện': 'nhóm', 'đếm người': 'nhóm', 'thất lạc': 'nhóm', 'bị lạc': 'nhóm', 'mất học sinh': 'nhóm', 'tách đoàn': 'nhóm', 'đi lẻ': 'nhóm', 'tìm học sinh': 'nhóm', 'quản lý thành viên': 'nhóm', 'theo dõi đoàn': 'nhóm', 'quản lý lớp': 'nhóm',

        // 5. KỶ LUẬT
        'ý thức': 'kỷ luật', 'kỷ luật': 'kỷ luật', 'nội quy': 'kỷ luật', 'phạt': 'kỷ luật', 'thưởng': 'kỷ luật', 'hành vi': 'kỷ luật', 'quậy phá': 'kỷ luật', 'nghịch': 'kỷ luật', 'đánh nhau': 'kỷ luật', 'vi phạm': 'kỷ luật', 'tuân thủ': 'kỷ luật', 'quy tắc': 'kỷ luật',

        // 6. SỨC KHỎE
        'vấn đề an toàn': 'sức khỏe', 'sức khỏe': 'sức khỏe', 'y tế': 'sức khỏe', 'ốm': 'sức khỏe', 'đau': 'sức khỏe', 'tai nạn': 'sức khỏe', 'rủi ro y tế': 'sức khỏe', 'thuốc': 'sức khỏe', 'ngộ độc': 'sức khỏe', 'dị ứng': 'sức khỏe', 'bị thương': 'sức khỏe', 'cấp cứu': 'sức khỏe', 'say nắng': 'sức khỏe', 'sơ cứu': 'sức khỏe',

        // 7. TÂM LÝ
        'tâm lý': 'tâm lý', 'cảm xúc': 'tâm lý', 'hoảng sợ': 'tâm lý', 'lo lắng': 'tâm lý', 'bắt nạt': 'tâm lý', 'stress': 'tâm lý', 'nhút nhát': 'tâm lý', 'sợ hãi': 'tâm lý', 'tinh thần': 'tâm lý', 'trầm cảm': 'tâm lý', 'vui vẻ': 'tâm lý',

        // 8. LIÊN LẠC
        'liên lạc': 'liên lạc', 'thông tin': 'liên lạc', 'zalo': 'liên lạc', 'phụ huynh': 'liên lạc', 'hotline': 'liên lạc', 'số điện thoại': 'liên lạc', 'báo cáo': 'liên lạc', 'cập nhật': 'liên lạc', 'kết nối': 'liên lạc', 'thông báo': 'liên lạc',

        // 9. NHÂN SỰ
        'nhân sự': 'nhân sự', 'giáo viên': 'nhân sự', 'hdv': 'nhân sự', 'điều hành': 'nhân sự', 'người quản lý': 'nhân sự', 'thầy cô': 'nhân sự', 'hướng dẫn viên': 'nhân sự', 'phân công': 'nhân sự', 'trách nhiệm': 'nhân sự',

        // 10. LỊCH TRÌNH
        'thời gian': 'lịch trình', 'lịch trình': 'lịch trình', 'giờ giấc': 'lịch trình', 'đi đâu': 'lịch trình', 'kế hoạch': 'lịch trình', 'trễ giờ': 'lịch trình', 'chậm': 'lịch trình', 'lộ trình': 'lịch trình', 'chương trình': 'lịch trình',

        // 11. PHỐI HỢP
        'phối hợp': 'phối hợp', 'nhà trường': 'phối hợp', 'công ty': 'phối hợp', 'đối tác': 'phối hợp', 'hợp đồng': 'phối hợp', 'cam kết': 'phối hợp', 'thống nhất': 'phối hợp', 'trao đổi': 'phối hợp',

        // 12. PHÁP LÝ
        'quy trình': 'pháp lý', 'pháp lý': 'pháp lý', 'luật': 'pháp lý', 'bảo hiểm': 'pháp lý', 'xin phép': 'pháp lý', 'bgh': 'pháp lý', 'hiệu trưởng': 'pháp lý', 'phiếu đồng ý': 'pháp lý', 'giấy tờ': 'pháp lý', 'thủ tục': 'pháp lý',

        // 13. CÔNG NGHỆ
        'công nghệ': 'công nghệ', 'app': 'công nghệ', 'phần mềm': 'công nghệ', 'qr': 'công nghệ', 'gps': 'công nghệ', 'định vị': 'công nghệ', 'số hóa': 'công nghệ', 'điện tử': 'công nghệ', 'ứng dụng': 'công nghệ', 'vệ tinh': 'công nghệ', 'internet': 'công nghệ', 'cloud': 'công nghệ', 'dữ liệu': 'công nghệ',

        // TỪ KHÓA QUẢN TRỊ MỚI
        'chọn công ty': 'nhà thầu', 'chọn đơn vị': 'nhầu thầu', 'nhà thầu': 'nhà thầu', 'đơn vị lữ hành': 'nhà thầu', 'công ty du lịch': 'nhà thầu', 'hồ sơ năng lực': 'nhà thầu', 'uy tín': 'nhà thầu',
        'tiêu chuẩn xe': 'vận chuyển', 'xe du lịch': 'vận chuyển', 'ô tô': 'vận chuyển', 'vận chuyển': 'vận chuyển', 'lái xe': 'vận chuyển', 'an toàn xe': 'vận chuyển', 'đời xe': 'vận chuyển',
        'ăn uống': 'thực phẩm', 'thực phẩm': 'thực phẩm', 'ngộ độc': 'thực phẩm', 'nhà hàng': 'thực phẩm', 'suất ăn': 'thực phẩm', 'vệ sinh': 'thực phẩm', 'menu': 'thực phẩm',
        'đền bù': 'bảo hiểm', 'bồi thường': 'bảo hiểm'
    };

    // --- AI LOGIC FUNCTIONS ---
    function appendMessage(sender, text) {
        if (!chatMessages) return;
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${sender} animate-fade`;

        // Optimize line breaks (handle double newlines for significant spacing)
        let formattedText = text.replace(/\n\n\n+/g, '<br><div style="margin-bottom: 25px;"></div>')
            .replace(/\n\n/g, '<br><div style="margin-bottom: 18px;"></div>')
            .replace(/\n/g, '<br>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/📌/g, '<span style="color: #4f46e5;">📌</span>')
            .replace(/✅/g, '<span style="color: #10b981;">✅</span>')
            .replace(/❌/g, '<span style="color: #ef4444;">❌</span>')
            .replace(/⚠️/g, '<span style="color: #f59e0b;">⚠️</span>')
            .replace(/🔎/g, '<span style="color: #06b6d4;">🔎</span>')
            .replace(/📍/g, '<span style="color: #f59e0b;">📍</span>')
            .replace(/💡/g, '<span style="color: #fbbf24;">💡</span>')
            .replace(/✨/g, '<span style="color: #a855f7;">✨</span>')
            .replace(/🤖/g, '<span style="color: #3b82f6;">🤖</span>')
            .replace(/🌈/g, '<span style="color: #f43f5e;">🌈</span>');

        chatMessages.appendChild(msgDiv);

        if (sender === 'ai') {
            msgDiv.innerHTML = "";
            let i = 0;
            // Target 5 seconds (5000ms) for total message
            // Min speed 2ms, max speed 20ms
            const dynamicSpeed = Math.max(2, Math.min(20, Math.floor(5000 / formattedText.length)));

            function typeWriter() {
                if (i < formattedText.length) {
                    if (formattedText.charAt(i) === '<') {
                        const tagEnd = formattedText.indexOf('>', i);
                        if (tagEnd !== -1) {
                            msgDiv.innerHTML += formattedText.substring(i, tagEnd + 1);
                            i = tagEnd + 1;
                        } else {
                            msgDiv.innerHTML += formattedText.charAt(i);
                            i++;
                        }
                    } else {
                        msgDiv.innerHTML += formattedText.charAt(i);
                        i++;
                    }
                    chatMessages.scrollTop = chatMessages.scrollHeight;
                    setTimeout(typeWriter, dynamicSpeed);
                }
            }
            typeWriter();
        } else {
            msgDiv.innerHTML = formattedText;
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    }

    function getAIResponse(input) {
        const query = input.toLowerCase();

        // --- 1. GREETING CASE ---
        if (query.includes('chào') || query.includes('hello') || query === 'hi') {
            return "🤖 **CHUYÊN GIA TƯ VẤN DU LỊCH TRƯỜNG HỌC (STA)**\n\nChào bạn! Tôi là **STA**, trợ lý AI chuyên về tư vấn các chuyến đi du lịch trường học.\n\nBạn có thể thử hỏi tôi:\n📍 **Địa điểm:** \"Tư vấn chuyến đi THCS\", \"An toàn tại Củ Chi?\"...\n🛡️ **Quản lý:** \"Cách điểm danh đoàn đông\", \"Xử lý y tế\"...\n💰 **Ngân sách:** \"Ngân sách 200k đi đâu?\"\n\n💬 **Mời bạn chia sẻ nhu cầu để tôi phân tích chuyên sâu.**";
        }

        // --- 1.1 CROSS-CONTEXT ANALYSIS (LOCATION + MANAGEMENT ISSUE) ---
        let crossLoc = null;
        for (let locKey in locationsKB) {
            if (query.includes(locKey)) {
                crossLoc = locationsKB[locKey];
                break;
            }
        }

        let crossIssueKey = null;
        const mgmtKeys = ['quy mô', 'thất lạc', 'điểm danh', 'nhóm', 'sức khỏe', 'tâm lý', 'liên lạc', 'nhân sự', 'lịch trình', 'phối hợp', 'công nghệ', 'nhà thầu', 'vận chuyển', 'thực phẩm', 'bảo hiểm', 'pháp lý', 'kỷ luật'];
        for (const k of mgmtKeys) {
            const kwds = Object.keys(keywordMapper).filter(kw => keywordMapper[kw] === k);
            if (kwds.some(kw => query.includes(kw))) {
                crossIssueKey = k;
                break;
            }
        }

        if (crossLoc && crossIssueKey) {
            const issueData = issuesKB[crossIssueKey];
            const specificRisk = crossLoc.debate.replace('⚠️ **Góc nhìn từ chuyên gia STA:**', '').trim();

            return `🛡️ **PHÂN TÍCH QUẢN TRỊ NGỮ CẢNH (STA CROSS-ANALYSIS):**\n` +
                `------------------------------------------\n\n` +
                `📍 **Địa điểm:** ${crossLoc.name}\n` +
                `📌 **Vấn đề phân tích:** ${issueData.title}\n\n` +
                `🔎 **PHẢN BIỆN THỰC ĐỊA:**\nTại **${crossLoc.name.split('(')[0].trim()}**, việc xử lý vấn đề **${issueData.title.toLowerCase()}** cần được tùy chỉnh theo đặc thù không gian tại đây. ${specificRisk}\n\n` +
                `✅ **GIẢI PHÁP TỐI ƯU (STA):**\n` +
                `• **Giải pháp chung:** ${issueData.solution}\n` +
                `• **Áp dụng tại điểm:** Cần đặc biệt chú trọng việc giám sát tại các điểm nút của ${crossLoc.name.split('(')[0].trim()} và ứng dụng ${issueData.tech.toLowerCase()} để kiểm soát.\n\n` +
                `📝 **TÌNH HUỐNG GIẢ ĐỊNH:**\n${issueData.example}\n\n` +
                `------------------------------------------\n` +
                `*Phân tích này kết hợp giữa 13 danh mục quản trị rủi ro và 12 địa điểm trong hệ thống dữ liệu độc quyền của STA.*`;
        }



        // --- 2.1 EXPERT RESPONSE LOGIC (PRIORITY INTENTS) ---
        // A. An toàn tại [địa điểm] - Ưu tiên nhận diện trước FAQ
        let matchedSafetyLocPref = null;
        for (let key in locationsKB) {
            if (query.includes(key) && (query.includes('an toàn') || query.includes('rủi ro'))) {
                matchedSafetyLocPref = locationsKB[key];
                break;
            }
        }
        if (matchedSafetyLocPref) {
            let scale = "Cao";
            if (matchedSafetyLocPref.name.includes("SUỐI MƠ") || matchedSafetyLocPref.name.includes("TRE VIỆT")) scale = "Trung bình";
            return `🛡️ **PHÂN TÍCH AN TOÀN TẠI ${matchedSafetyLocPref.name}:**\n\n` +
                `🔍 **Rủi ro:** ${matchedSafetyLocPref.debate}\n\n` +
                `💡 **Khuyến nghị:** ${matchedSafetyLocPref.deepInfo.split('❌')[0].trim()}\n\n` +
                `📊 **Đánh giá:** **${scale}**`;
        }

        // B. Ngân sách [số tiền] đi đâu? - Ưu tiên nhận diện trước FAQ
        if (query.includes('ngân sách') || (query.includes('đi đâu') && query.match(/\d+/))) {
            const numbers = query.match(/\d+(\.\d+)?/g);
            let rawBudget = numbers ? parseFloat(numbers[0]) : 0;
            let budgetInK = rawBudget;
            if (query.includes('triệu') || query.includes('tr')) {
                budgetInK = rawBudget * 1000;
            } else if (rawBudget >= 1000) {
                budgetInK = rawBudget / 1000;
            }
            let suggestion = "Với ngân sách này, bạn có thể cân nhắc các điểm lịch sử nội đô như **Văn Miếu** hoặc **Dinh Độc Lập**.";
            if (budgetInK >= 150) suggestion = "Ngân sách khá tốt, nên chọn **Suối Mơ**, **Tre Việt** hoặc **Đầm Sen**.";
            if (budgetInK >= 500) suggestion = "Ngân sách cao, có thể tổ chức tour liên tỉnh như **Cố đô Huế** hoặc tổ chức sự kiện lớn tại **Đại Nam**.";
            return `💰 **TƯ VẤN NGÂN SÁCH (~${budgetInK >= 1000 ? (budgetInK / 1000).toFixed(1) + ' triệu' : budgetInK + 'k'}):**\n\n` +
                `🧭 **Ghi chú:** ${suggestion}\n\n` +
                `📝 **Bao gồm:** Vé cổng, Bảo hiểm, Phí quản lý cơ bản.\n\n*Lưu ý: Ngân sách chưa bao gồm xe di chuyển và ăn trưa.*`;
        }

        // C. Teambuilding - Ưu tiên nhận diện trước FAQ
        if (query.includes('teambuilding') || query.includes('hoạt động nhóm')) {
            return `🚩 **TƯ VẤN HOẠT ĐỘNG TEAM BUILDING (HỌC SINH):**\n\n` +
                `Dựa trên tiêu chí an toàn và ngân sách tiết kiệm, STA đề xuất các hoạt động giáo dục sau:\n\n` +
                `🏠 **HOẠT ĐỘNG TRONG NHÀ (INDOOR):**\n` +
                `1. **Tháp ống hút:** Xây tháp bằng vật liệu nhẹ. \n• **Mục tiêu:** Kỹ năng sáng tạo & Teamwork.\n2. **Kịch bản gỡ rối:** Xử lý tình huống giả định.\n\n` +
                `🌳 **HOẠT ĐỘNG NGOÀI TRỜI (OUTDOOR):**\n` +
                `3. **Vòng xoáy kết nối:** Giải mã nút thắt tay.\n4. **Vượt bãi mìn:** Dẫn đường cho thành viên bịt mắt.\n\n` +
                `📍 **Địa điểm phù hợp:** **Đại Nam**, **Tre Việt**, **Suối Mơ** hoặc **Đầm Sen**.\n\n` +
                `⚖️ **Nguyên tắc an toàn:** Tuyệt đối không tổ chức các trò chơi va chạm mạnh hoặc dưới nước sâu mà thiếu cứu hộ chuyên nghiệp.`;
        }

        // D. Tư vấn chuyến đi THCS - Khôi phục
        if (query.includes('tư vấn') && (query.includes('thcs') || query.includes('cấp 2'))) {
            return `📊 **TƯ VẤN CHUYẾN ĐI KHỐI THCS (CẤP 2):**\n\n` +
                `📍 **Đề xuất 1: Địa đạo Củ Chi / Dinh Độc Lập**\n• **Chi phí:** Thấp (~20k-40k vé). \n• **An toàn:** Cao. \n• **Trải nghiệm:** Giáo dục lòng yêu nước, thực địa lịch sử.\n\n` +
                `📍 **Đề xuất 2: Suối Mơ / Tre Việt**\n• **Chi phí:** Trung bình (~120k-200k combo). \n• **An toàn:** Cần giám sát nước. \n• **Trải nghiệm:** Teambuilding, dã ngoại.\n\n` +
                `📍 **Đề xuất 3: Ba Vì / Cần Giờ**\n• **Chi phí:** Trung bình. \n• **An toàn:** Cảnh báo rủi ro ngoại cảnh. \n• **Trải nghiệm:** Nghiên cứu Sinh học, Địa lý.`;
        }

        // E. Cách điểm danh đoàn đông - Khôi phục
        if (query.includes('điểm danh') || (query.includes('đông') && query.includes('đoàn'))) {
            return `📋 **QUY TRÌNH ĐIỂM DANH CHUYÊN NGHIỆP:**\n\n` +
                `🚀 **Giải pháp:** Sử dụng **QR Code** vòng tay và quản lý theo nhóm Buddy.\n\n` +
                `🔢 **Các bước:**\n1. Điểm danh cố định tại xe.\n2. Chia luồng soát vé tại cổng.\n3. Điểm danh đột xuất mỗi 60 phút tại trạm tập kết.\n\n` +
                `💡 **Mẹo:** Badge màu theo khối để nhận diện từ xa.`;
        }

        // F. Quy trình xin phép Sở/Phòng GD
        if (query.includes('xin phép') || query.includes('cấp phép') || query.includes('tờ trình')) {
            return `📜 **QUY TRÌNH XIN CẤP PHÉP NGOẠI KHÓA (CHUẨN BỘ GD&ĐT):**\n\n` +
                `Để chuyến đi đúng quy định pháp luật, nhà trường cần thực hiện:\n` +
                `1. **Xây dựng kế hoạch:** Mục đích, thời gian, địa điểm, thành phần đoàn.\n` +
                `2. **Thẩm định nhà thầu:** Kiểm tra giấy phép lữ hành & bảo hiểm ký quỹ của công ty du lịch.\n` +
                `3. **Tờ trình nộp cơ quan quản lý:** Gửi Phòng/Sở GD&ĐT trước ít nhất 15 ngày.\n` +
                `4. **Hợp đồng & Bảo hiểm:** Ký kết và chốt danh sách bảo hiểm 100% người đi đoàn.\n` +
                `5. **Cam kết phụ huynh:** Thu phiếu đồng ý có chữ ký trực tiếp.\n\n` +
                `💡 **STA Lưu ý:** Tuyệt đối không khởi hành khi chưa có văn bản phê duyệt từ cấp trên.`;
        }

        // G. Tiêu chuẩn xe 45 chỗ
        if (query.includes('xe 45') || query.includes('thuê xe') || query.includes('xe du lịch')) {
            return `🚌 **TIÊU CHUẨN XE DU LỊCH ĐOÀN ĐÔNG (45 CHỖ):**\n\n` +
                `Để đảm bảo an toàn 100%, STA khuyến nghị kiểm tra các hạng mục sau:\n` +
                `• **Đời xe:** Ưu tiên Universe/Thaco từ 2020 trở lên.\n` +
                `• **Nội thất:** Hệ thống điều hòa hoạt động tốt, micro thuyết minh rõ ràng.\n` +
                `• **Pháp lý:** Phù hiệu "Xe du lịch", Giấy chứng nhận kiểm định còn hạn.\n` +
                `• **Lái xe:** Có bằng E, kinh nghiệm chạy đoàn học sinh, thái độ đúng mực.\n\n` +
                `✅ **Mẹo:** Yêu cầu công ty cung cấp biển số xe và số điện thoại tài xế trước 1 ngày.`;
        }

        // H. Xử lý ngộ độc/Sức khỏe
        if (query.includes('ngộ độc') || query.includes('đau bụng') || query.includes('dị ứng')) {
            return `🚑 **QUY TRÌNH XỬ LÝ SỰ CỐ Y TẾ (STA KHẨN CẤP):**\n\n` +
                `Khi học sinh có dấu hiệu ngộ độc hoặc đau bụng đột xuất:\n` +
                `1. **Sơ cứu ngay:** Đưa HS đến khu vực thoáng mát, trạm y tế di động của đoàn.\n` +
                `2. **Cách ly nguồn tin:** Tránh gây hoảng loạn cho các học sinh khác.\n` +
                `3. **Kiểm tra mẫu thực phẩm:** Niêm phong mẫu thức ăn lưu của bữa gần nhất.\n` +
                `4. **Chuyển tuyến:** Nếu có trên 3 HS triệu chứng giống nhau, đưa ngay đến bệnh viện gần nhất.\n` +
                `5. **Báo cáo:** Cập nhật tình hình cho BGH và Phụ huynh ngay lập tức.\n\n` +
                `⚠️ **Lưu ý:** Tuyệt đối không tự ý cho HS uống thuốc lạ khi chưa có chỉ định của bác sĩ đoàn.`;
        }



        // --- 3. LOCATION & TRAVEL DATA HANDLING (EXPERT STA STYLE) ---
        // A. General inquiries for suggestions
        const generalInquiryKeywords = ['nên đi đâu', 'địa điểm nào phù hợp', 'gợi ý tham quan', 'địa điểm an toàn', 'địa điểm giá rẻ', 'chỗ nào hay'];
        if (generalInquiryKeywords.some(k => query.includes(k))) {
            const suggestion = locationsKB['củ chi'];
            return `Từ góc nhìn của STA, nếu bạn đang tìm kiếm một địa điểm hội tụ đủ các yếu tố về giá trị giáo dục, tính an toàn và chi phí hợp lý cho học sinh, chúng tôi đặc biệt đề xuất ${suggestion.name}. Đây là một điểm đến không chỉ giúp học sinh hiểu sâu sắc về lịch sử dân tộc thông qua hệ thống đường hầm huyền thoại mà còn là môi trường lý tưởng để rèn luyện kỹ năng quan sát và lòng yêu nước. Về mặt an toàn, khu vực này đã được quy hoạch hạ tầng du lịch rất bài bản, giúp giáo viên dễ dàng kiểm soát sĩ số đoàn đông. Chi phí tham quan tại đây cũng rất tiết kiệm, phù hợp với ngân sách của phần lớn các trường học hiện nay. STA khuyến nghị nhà trường nên lồng ghép các hoạt động đố vui lịch sử hoặc thi tìm hiểu ngay tại thực địa để tăng tính hứng thú cho chuyến đi. Đây chắc chắn sẽ là một lựa chọn an toàn và đầy ý nghĩa giúp học sinh có những trải nghiệm khó quên sau những giờ học căng thẳng trên lớp. Bạn có cần mình tư vấn thêm về lịch trình cụ thể tại đây không?`;
        }

        // B. Specific location handling
        let matchedLocation = null;
        for (let key in locationsKB) {
            if (query.includes(key)) {
                matchedLocation = locationsKB[key];
                break;
            }
        }

        if (matchedLocation) {
            // Trường hợp người dùng hỏi "Thông tin..."
            if (query.includes('thông tin')) {
                return `ℹ️ **HỒ SƠ THÔNG TIN CHI TIẾT (STA DATA CENTER):**\n` +
                    `------------------------------------------\n\n` +
                    `📍 **Địa điểm:** ${matchedLocation.name}\n` +
                    `🏠 **Địa chỉ:** ${matchedLocation.address}\n\n` +
                    `✨ **Giới thiệu:** ${matchedLocation.desc}\n\n` +
                    `🎓 **Giá trị giáo dục:**\n${matchedLocation.eduValue}\n\n` +
                    `🎢 **Hoạt động trải nghiệm:**\n${matchedLocation.activities}\n\n` +
                    `👥 **Đối tượng phù hợp:**\n${matchedLocation.suitability}\n\n` +
                    `💰 **Chi phí tham khảo:**\n${matchedLocation.cost}\n\n` +
                    `🛡️ **Phân tích chuyên sâu:**\n${matchedLocation.deepInfo}\n\n` +
                    `⚖️ **Góc nhìn STA:**\n${matchedLocation.debate}\n\n` +
                    `------------------------------------------\n` +
                    `*Bạn có thể gõ tên địa điểm (không kèm từ "thông tin") để nhận bản tư vấn có lịch trình tham khảo!*`;
            }

            // Trường hợp mặc định: Bản tư vấn 8 mục
            const itinerary = `⏰ **07:00:** Tập trung tại trường, kiểm tra sĩ số, khởi hành.\n⏰ **09:00:** Đến **${matchedLocation.name}**, bắt đầu hoạt động tham quan & học tập.\n⏰ **11:30:** Ăn trưa tại nhà hàng/khu vực dã ngoại & nghỉ ngơi tại chỗ.\n⏰ **14:00:** Tham gia các hoạt động Teambuilding đoàn đông hoặc tự do khám phá.\n⏰ **16:00:** Tập kết đoàn, vệ sinh khu vực, lên xe trở về.\n⏰ **18:00:** Về đến trường, giáo viên bàn giao học sinh cho phụ huynh.`;

            const prep = matchedLocation.deepInfo.includes('✅')
                ? matchedLocation.deepInfo.split('❌')[0].replace('✅ **Nên làm (Should):**', '').trim()
                : "Chuẩn bị trang phục thoải mái, giày thể thao, mũ nón, nước uống và sổ tay ghi chép.";

            const notice = matchedLocation.deepInfo.includes('❌')
                ? matchedLocation.deepInfo.split('❌')[1].replace('**Không nên (Should Not):**', '').trim()
                : "Tuyệt đối tuân thủ nội quy của điểm tham quan và hướng dẫn của giáo viên/HDV.";

            return `🤖 **BẢN TƯ VẤN DU LỊCH CHI TIẾT (STA EXPERT):**\n` +
                `------------------------------------------\n\n` +
                `1️⃣ **GIỚI THIỆU ĐỊA ĐIỂM:**\n${matchedLocation.desc}\n\n` +
                `2️⃣ **ĐỐI TƯỢNG PHÙ HỢP:**\n${matchedLocation.suitability}\n\n` +
                `3️⃣ **HOẠT ĐỘNG CHÍNH:**\n${matchedLocation.activities}\n\n` +
                `4️⃣ **CHI PHÍ DỰ KIẾN:**\n${matchedLocation.cost}\n\n` +
                `5️⃣ **LỊCH TRÌNH THAM KHẢO (1 NGÀY):**\n${itinerary}\n\n` +
                `6️⃣ **NHỮNG THỨ CẦN CHUẨN BỊ:**\n${prep}\n\n` +
                `7️⃣ **LƯU Ý QUAN TRỌNG:**\n${notice}\n\n` +
                `8️⃣ **KHUYẾN NGHỊ TỪ AI (STA):**\n${matchedLocation.debate}\n\n` +
                `------------------------------------------\n` +
                `*STA luôn đồng hành cùng nhà trường để tạo ra những chuyến đi an toàn và giàu tính giáo dục nhất.*`;
        }

        // C. Fallback for travel locations
        if (query.includes('đi') || query.includes('du lịch') || query.includes('tham quan')) {
            const locName = query.split('đi')[1]?.trim() || "địa điểm này";
            return `Mặc dù ${locName} hiện không nằm trong danh sách 12 điểm đến tiêu chuẩn do STA trực tiếp quản trị dữ liệu, nhưng từ góc nhìn chuyên môn, chúng tôi đánh giá đây có thể là một không gian trải nghiệm thú vị dựa trên đặc trưng địa lý và văn hóa vùng miền của nó. Thông thường, một địa điểm như vậy sẽ mang lại giá trị giáo dục cao về đa dạng sinh học, địa lý hoặc văn hóa đời sống, giúp học sinh mở rộng tầm nhìn thực tế. Tuy nhiên, vì đây là điểm ngoài danh sách tối ưu, STA khuyến nghị ban giám hiệu và giáo viên cần thực hiện một buổi khảo sát thực địa (tiền trạm) ít nhất 2 tuần trước khi khởi hành để kiểm tra các yếu tố an toàn.`;
        }

        // --- 4. MANAGEMENT ISSUES HANDLING ---
        const legalKeywords = ["pháp lý", "giấy phép", "pháp luật", "thủ tục"];
        if (legalKeywords.some(kw => query.includes(kw))) {
            const issue = issuesKB['pháp lý'];
            return `🛠️ **BÁO CÁO PHÂN TÍCH QUẢN TRỊ (STA):**\n\n📌 **VẤN ĐỀ: ${issue.title}**\n\n🔍 **Nguyên nhân:** ${issue.rootCause}\n\n⚠️ **Rủi ro:** ${issue.risks}\n\n✅ **Giải pháp:** ${issue.solution}\n\n📝 **Ví dụ:** ${issue.example}\n\n🚀 **Công nghệ:** ${issue.tech}`;
        }

        const disciplineKeywords = ["kỷ luật", "tuân thủ", "nội quy"];
        if (disciplineKeywords.some(kw => query.includes(kw))) {
            const issue = issuesKB['kỷ luật'];
            return `🛠️ **BÁO CÁO PHÂN TÍCH QUẢN TRỊ (STA):**\n\n📌 **VẤN ĐỀ: ${issue.title}**\n\n🔍 **Nguyên nhân:** ${issue.rootCause}\n\n⚠️ **Rủi ro:** ${issue.risks}\n\n✅ **Giải pháp:** ${issue.solution}\n\n📝 **Ví dụ:** ${issue.example}\n\n🚀 **Công nghệ:** ${issue.tech}`;
        }

        const otherIssueKeys = ['quy mô', 'thất lạc', 'điểm danh', 'nhóm', 'sức khỏe', 'tâm lý', 'liên lạc', 'nhân sự', 'lịch trình', 'phối hợp', 'công nghệ', 'nhà thầu', 'vận chuyển', 'thực phẩm', 'bảo hiểm', 'pháp lý', 'kỷ luật'];
        for (const k of otherIssueKeys) {
            const keysForThisIssue = Object.keys(keywordMapper).filter(kw => keywordMapper[kw] === k);
            if (keysForThisIssue.some(kw => query.includes(kw))) {
                const issue = issuesKB[k];
                if (issue) {
                    return `🛠️ **BÁO CÁO PHÂN TÍCH QUẢN TRỊ (STA):**\n\n📌 **VẤN ĐỀ: ${issue.title}**\n\n` +
                        `🔍 **Nguyên nhân gốc rễ:** ${issue.rootCause}\n\n` +
                        `⚠️ **Rủi ro tiềm ẩn:** ${issue.risks}\n\n` +
                        `✅ **Giải pháp tối ưu (STA):** ${issue.solution}\n\n` +
                        `📝 **Tình huống thực tế:** ${issue.example}\n\n` +
                        `🚀 **Ứng dụng công nghệ:** ${issue.tech}\n\n` +
                        `------------------------------------------\n` +
                        `*STA đảm bảo thông tin trên được đối soát dựa trên quy trình quản trị rủi ro học đường tiêu chuẩn.*`;
                }
            }
        }

        const travelKeywords = ['ngân sách', 'đi đâu', 'điểm danh', 'teambuilding', 'an toàn', 'quản lý', 'y tế', 'sức khỏe', 'thủ tục', 'pháp lý', 'nhà thầu', 'vận chuyển', 'thực phẩm', 'đông', 'đoàn', 'tư vấn', 'thcs', 'cấp 2', 'xe', 'ăn', 'ngộ độc', 'du lịch', 'chuyến đi', 'tham quan', 'tour', 'ngoại khóa', 'trải nghiệm', 'giá vé', 'chi phí', 'địa điểm', 'trường học', 'học sinh'];
        const isRelatedToTravel = travelKeywords.some(k => query.includes(k));

        if (!isRelatedToTravel && query.length > 10) {
            return `🤖 **HỆ THỐNG TƯ VẤN CHUYÊN BIỆT (STA)**\n\n` +
                `Tôi là trợ lý được lập trình **chuyên biệt cho du lịch trường học**. Để đảm bảo độ chính xác 100%, tôi sẽ không trả lời các câu hỏi ngoài phạm vi này (như thời tiết, toán học, hay tin tức giải trí).\n\n` +
                `**Vui lòng hỏi tôi các vấn đề liên quan đến:**\n` +
                `• Quy trình pháp lý, bảo hiểm, chọn nhà thầu uy tín.\n` +
                `• An toàn thực phẩm, tiêu chuẩn xe, quản lý học sinh đoàn đông.\n` +
                `• Thông tin chi tiết về 12 địa điểm du lịch tiêu chuẩn trong hệ thống.\n\n` +
                `*Hãy đặt câu hỏi cụ thể, ví dụ: "Làm sao để chọn công ty du lịch uy tín?"*`;
        }

        return `🤖 **(STA) Xin lỗi hiện tại tôi chỉ có thể cung cấp thông tin về 13 vấn đề thường gặp và 12 địa điểm du lịch đã có sẵn trong hệ thống SchoolTrip AI.**\n\n` +
            `Bạn có thể thử hỏi về:\n` +
            `🔹 **Vấn đề quản lý:** Điểm danh học sinh, Xử lý y tế, Kỷ luật đoàn, Quản lý nhóm...\n` +
            `📍 **Địa điểm tiêu biểu:** Dinh Độc Lập, Địa đạo Củ Chi, Suối Mơ, Đầm Sen...\n\n` +
            `Vui lòng chọn 1 trong những nội dung đó để tôi có thể hỗ trợ tốt nhất!`;
    }

    // --- EVENT LISTENERS ---
    if (chatForm && chatInput) {
        chatForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const message = chatInput.value.trim();
            if (message) {
                appendMessage('user', message);
                chatInput.value = '';
                setTimeout(() => {
                    let response = getAIResponse(message);
                    // Add follow-up question if it's not a greeting or error
                    if (!response.includes("Mời bạn chia sẻ nhu cầu")) {
                        response += "\n\n💬 **Bạn có cần mình tư vấn gì thêm nữa không?**";
                    }
                    appendMessage('ai', response);
                }, 600);
            }
        });
    }
});

