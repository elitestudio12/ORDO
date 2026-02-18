document.addEventListener('DOMContentLoaded', function () {

    var map = L.map('map').setView([28.0, 3.0], 5);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap'
    }).addTo(map);

    var greenIcon = L.divIcon({
        html: '<div style="background:#1b5e42;width:14px;height:14px;border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);"></div>',
        className: '',
        iconSize: [14, 14],
        iconAnchor: [7, 7]
    });

    var cities = [
        { name: 'الجزائر العاصمة', lat: 36.7538, lng: 3.0588 },
        { name: 'وهران', lat: 35.6972, lng: -0.6337 },
        { name: 'قسنطينة', lat: 36.3650, lng: 6.6147 },
        { name: 'عنابة', lat: 36.9000, lng: 7.7667 },
        { name: 'سطيف', lat: 36.1898, lng: 5.4136 },
        { name: 'تيزي وزو', lat: 36.7169, lng: 4.0497 }
    ];

    cities.forEach(function (city) {
        L.marker([city.lat, city.lng], { icon: greenIcon })
            .addTo(map)
            .bindPopup('<strong style="font-family:Cairo,sans-serif;font-size:13px;">' + city.name + '</strong><br><small style="color:#5a7066;">بلدية متاحة على ORDO</small>');
    });

    var userMarker = null;
    var locateBtn = document.getElementById('locate-btn');
    var locationStatus = document.getElementById('location-status');

    locateBtn.addEventListener('click', function () {
        locationStatus.textContent = 'جاري تحديد موقعك...';
        locationStatus.style.color = '#5a7066';

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                function (position) {
                    var lat = position.coords.latitude;
                    var lng = position.coords.longitude;

                    var userIcon = L.divIcon({
                        html: '<div style="background:#c8a84b;width:16px;height:16px;border-radius:50%;border:3px solid white;box-shadow:0 2px 10px rgba(0,0,0,0.4);"></div>',
                        className: '',
                        iconSize: [16, 16],
                        iconAnchor: [8, 8]
                    });

                    if (userMarker) {
                        userMarker.setLatLng([lat, lng]);
                    } else {
                        userMarker = L.marker([lat, lng], { icon: userIcon }).addTo(map);
                    }

                    userMarker.bindPopup('<strong style="font-family:Cairo,sans-serif;font-size:13px;">موقعك الحالي</strong>').openPopup();
                    map.setView([lat, lng], 11, { animate: true });

                    locationStatus.innerHTML = '<span style="color:#1b5e42;font-weight:600;">✓ تم تحديد موقعك بنجاح</span>';
                },
                function () {
                    locationStatus.innerHTML = '<span style="color:#c62828;">✗ فشل تحديد الموقع، يرجى المحاولة مجدداً</span>';
                }
            );
        } else {
            locationStatus.innerHTML = '<span style="color:#c62828;">المتصفح لا يدعم خاصية GPS</span>';
        }
    });

    document.getElementById('citizen-btn').addEventListener('click', function () {
        alert('مرحباً بك مواطننا العزيز\nسيتم تحويلك إلى لوحة تحكم المواطن');
    });

    document.getElementById('national-btn').addEventListener('click', function () {
        alert('مرحباً بالمصالح الوطنية\nسيتم تحويلك إلى بوابة المؤسسات');
    });

    document.querySelectorAll('.muni-card').forEach(function (card) {
        card.addEventListener('click', function () {
            var name = this.querySelector('h4').textContent;
            var lat = parseFloat(this.getAttribute('data-lat'));
            var lng = parseFloat(this.getAttribute('data-lng'));
            map.setView([lat, lng], 12, { animate: true });
            document.getElementById('map-section').scrollIntoView({ behavior: 'smooth' });
        });
    });

    document.querySelectorAll('.service-card').forEach(function (card) {
        card.addEventListener('click', function () {
            var name = this.querySelector('h4').textContent;
            alert('سيتم تحويلك إلى صفحة خدمة: ' + name);
        });
    });

    var statNums = document.querySelectorAll('.stat-num');
    var animated = false;

    function animateStats() {
        if (animated) return;
        var statsSection = document.querySelector('.stats-section');
        if (!statsSection) return;
        var rect = statsSection.getBoundingClientRect();
        if (rect.top < window.innerHeight - 100) {
            animated = true;
            statNums.forEach(function (el) {
                var target = parseInt(el.getAttribute('data-target'));
                var duration = 1800;
                var start = null;

                function step(timestamp) {
                    if (!start) start = timestamp;
                    var progress = Math.min((timestamp - start) / duration, 1);
                    var eased = 1 - Math.pow(1 - progress, 3);
                    el.textContent = Math.floor(eased * target);
                    if (progress < 1) {
                        requestAnimationFrame(step);
                    } else {
                        el.textContent = target;
                    }
                }

                requestAnimationFrame(step);
            });
        }
    }

    window.addEventListener('scroll', animateStats);
    animateStats();

    var topnav = document.querySelector('.topnav');
    window.addEventListener('scroll', function () {
        if (window.scrollY > 80) {
            topnav.style.boxShadow = '0 4px 20px rgba(0,0,0,0.2)';
        } else {
            topnav.style.boxShadow = 'none';
        }
    });
});