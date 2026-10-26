const SUPABASE_URL = "https://yhyzuaaxefcwvzmpbvol.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_bnKZTYBlYg5PAkwEk_PTTQ_H3b5ZF7g";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);
// ===============================
// PACKAGE SELECTOR
// ===============================

function selectPackage(packageName) {

    document.getElementById("package").value = packageName;

    document.getElementById("booking").scrollIntoView({
        behavior: "smooth"
    });
}


// ===============================
// BOOKING FORM
// ===============================

document
    .getElementById("bookingForm")
    .addEventListener("submit", async function (event) {

        event.preventDefault();

        const name =
            document.getElementById("name").value.trim();

        const phone =
            document.getElementById("phone").value.trim();

        const date =
            document.getElementById("date").value;

        const eventType =
            document.getElementById("eventType").value;

        const packageName =
            document.getElementById("package").value;

        const location =
            document.getElementById("location").value.trim();

        const paymentMethod =
            document.getElementById("paymentMethod").value;


        // Location check
        if (location === "") {

            alert(
                "⚠️ Please apni complete event location enter karein."
            );

            return;
        }


        // Check if same date already has a booking
        const {
            data: existingBooking,
            error: dateCheckError
        } = await supabaseClient
            .from("Bookings")
            .select("id")
            .eq("date", date)
            .neq("status", "rejected")
            .limit(1);


        if (dateCheckError) {

            console.error(
                "Date Check Error:",
                dateCheckError
            );

            alert(
                "❌ Date availability check nahi ho paayi.\n\n" +
                "Please dobara try karein."
            );

            return;
        }


        const dateAlreadyBooked =
            existingBooking.length > 0;

const bookingId =
    "MB-" + Math.floor(100000 + Math.random() * 900000);
    const approvalToken = crypto.randomUUID();
        // Save booking
        const { error } =
            await supabaseClient
                .from("Bookings")
                .insert([
                    {
                        name: name,
                        phone: phone,
                        date: date,
                        event_type: eventType,
                        package: packageName,
                        location: location,
                        payment_method: paymentMethod,
                        booking_id: bookingId,
                        approval_token: approvalToken,
                        status: "pending"
                    }
                ]);


        if (error) {

            console.error(
                "Booking Error:",
                JSON.stringify(error, null, 2)
            );

            alert(
                "❌ Booking save nahi ho paayi.\n\n" +
                "Please dobara try karein."
            );

            return;
        }


        // ===============================
        // WHATSAPP MESSAGE
        // ===============================

        const whatsappNumber = "6299221773";


        let message = "";
const statusFunctionUrl =
  "https://yhyzuaaxefcwvzmpbvol.supabase.co/functions/v1/booking-status";

const approveLink =
  `${statusFunctionUrl}?token=${encodeURIComponent(approvalToken)}&status=approved`;

const rejectLink =
  `${statusFunctionUrl}?token=${encodeURIComponent(approvalToken)}&status=rejected`;

const pendingLink =
  `${statusFunctionUrl}?token=${encodeURIComponent(approvalToken)}&status=pending`;

        if (dateAlreadyBooked) {

            message =
                "Hello, I want to book Mehndi.%0A%0A" +
"🆔 Booking ID: " + bookingId + "%0A" +
                "Name: " + name + "%0A" +
                "Phone: " + phone + "%0A" +
                "Event: " + eventType + "%0A" +
                "Date: " + date + "%0A" +
                "Package: " + packageName + "%0A" +
                "Location: " + location + "%0A%0A" +

                "⚠️ This date already has a booking.%0A" +
                "My booking is currently WAITING / PENDING.%0A%0A" +

                "Please let me know within 24 hours " +
                "whether my booking is confirmed or not.";


        } else {

            message =
                "Hello, I want to book Mehndi.%0A%0A" +
"🆔 Booking ID: " + bookingId + "%0A" +
                "Name: " + name + "%0A" +
                "Phone: " + phone + "%0A" +
                "Event: " + eventType + "%0A" +
                "Date: " + date + "%0A" +
                "Package: " + packageName + "%0A" +
                "Location: " + location + "%0A%0A" +

                "My booking is currently WAITING / PENDING.%0A" +
                "Please confirm my booking within 24 hours.";
        }
message +=
  "%0A%0A" +
  "━━━━━━━━━━━━━━━━━━%0A" +
  "📌 BOOKING STATUS CONTROL%0A" +
  "━━━━━━━━━━━━━━━━━━%0A%0A" +
  "🟢 APPROVE BOOKING:%0A" +
  approveLink +
  "%0A%0A" +
  "🔴 REJECT BOOKING:%0A" +
  rejectLink +
  "%0A%0A" +
  "🟡 KEEP PENDING:%0A" +
  pendingLink;

        const whatsappURL =
  "https://wa.me/" +
  whatsappNumber +
  "?text=" +
  encodeURIComponent(message.replaceAll("%0A", "\n"));


        // ===============================
        // CUSTOMER MESSAGE
        // ===============================

        if (dateAlreadyBooked) {

            alert(
                "⚠️ Is date par pehle se ek booking hai.\n\n" +
                "⏳ Aapki booking abhi WAITING mein hai.\n\n" +
                "📢 Hum aapko 24 hours ke andar bata denge " +
                "ki aapki booking CONFIRM hui hai ya nahi.\n\n" +
                "⚠️ Please apni booking details save kar lein."
            );

        } else {

            alert(
    "✅ Booking request submit ho gayi!\n\n" +
    "🆔 Your Booking ID: " + bookingId + "\n\n" +
    "⏳ Status: WAITING / PENDING\n\n" +
    "📢 Hum aapko 24 hours ke andar bata denge " +
    "ki aapki booking CONFIRM hui hai ya nahi.\n\n" +
    "⚠️ Please apni Booking ID save kar lein."
);
        }


        // Open WhatsApp
        window.location.href = whatsappURL;

    });


// ===============================
// Check Booking Status
async function checkBookingStatus() {

    const bookingId =
        document.getElementById("checkBookingId").value.trim();

    const phone =
        document.getElementById("checkBookingPhone").value.trim();

    const result =
        document.getElementById("bookingStatusResult");

    if (bookingId === "" || phone === "") {
        result.innerHTML =
            "⚠️ Please Booking ID aur Phone Number dono bhariye.";
        return;
    }

    result.innerHTML = "🔍 Booking check ho rahi hai...";

    const { data, error } =
    await supabaseClient
        .rpc("check_booking_status", {
            p_booking_id: bookingId,
            p_phone: phone
        })
        .maybeSingle();

    if (error || !data) {
        result.innerHTML =
            "❌ Booking nahi mili. Booking ID aur Phone Number check karein.";
        return;
    }

    let statusMessage = "";

    if (data.status === "pending") {
        statusMessage =
            "🟡 WAITING / PENDING";
    } else if (data.status === "approved") {
        statusMessage =
            "🟢 BOOKING APPROVED";
    } else if (data.status === "rejected") {
        statusMessage =
            "🔴 BOOKING REJECTED";
    } else if (data.status === "confirmed") {
        statusMessage =
            "✅ BOOKING CONFIRMED";
    }

    result.innerHTML = `
        <div style="margin-top:20px; padding:15px; border-radius:10px; background:#f8eee3;">
            <h3>${statusMessage}</h3>
            <p><strong>Name:</strong> ${data.name}</p>
            <p><strong>Booking ID:</strong> ${data.booking_id}</p>
            <p><strong>Date:</strong> ${data.date}</p>
        </div>
    `;
}
// CUSTOMER REVIEW
// ===============================

async function addReview() {

    const name =
        document.getElementById("reviewName").value.trim();

    const rating =
        Number(document.getElementById("rating").value);

    const text =
        document.getElementById("reviewText").value.trim();

    if (name === "" || text === "") {
        alert("Please apna naam aur review likhiye.");
        return;
    }

    const { error } = await supabaseClient
        .from("reviews")
        .insert([
            {
                name: name,
                rating: rating,
                text: text,
                approved: false
            }
        ]);

    if (error) {
        console.error("Review Error:", error);
        alert("❌ Review submit nahi ho paaya.");
        return;
    }

    document.getElementById("reviewName").value = "";
    document.getElementById("reviewText").value = "";

    alert("⭐ Review submit ho gaya! Admin approval ke baad website par dikhega.");
}

    

// ==================== PUBLIC GALLERY ====================

// ================= PUBLIC GALLERY =================

async function loadPublicGallery() {

    const gallery =
        document.getElementById("publicGallery");

    if (!gallery) return;

    gallery.innerHTML =
        "<p style='text-align:center;'>Designs load ho rahe hain...</p>";

    const { data, error } =
        await supabaseClient
            .storage
            .from("mehndi-images")
            .list("", {
                limit: 100,
                sortBy: {
                    column: "name",
                    order: "asc"
                }
            });

    if (error) {

        console.error("Gallery Error:", error);

        gallery.innerHTML =
            "<p>Gallery load nahi ho paayi.</p>";

        return;
    }

   const images = data.filter(
    file =>
        file.name !== ".emptyFolderPlaceholder" &&
        file.id
);

    gallery.innerHTML = "";

    if (images.length === 0) {

        gallery.innerHTML =
            "<p>Abhi koi design available nahi hai.</p>";

        return;
    }

    images.forEach(file => {

        const fileName =
            file.name.toLowerCase();

        let title = "Mehndi Design";
        let description = "Beautiful Mehndi Design";
        let category = "all";

       if (fileName === "mehndi1.jpg") {

    title = "Bridal Mehndi";
    description = "For Your Big Day";
    category = "bridal";

} else if (fileName === "mehndi2.jpg") {

    title = "Arabic Mehndi";
    description = "Simple Yet Stunning";
    category = "arabic";

} else if (fileName === "mehndi3.jpg") {

    title = "Simple Mehndi";
    description = "Elegance in Simplicity";
    category = "simple";

} else if (fileName === "mehndi4.jpg") {

    title = "Wedding Mehndi";
    description = "Traditional & Timeless";
    category = "wedding";

} else {

        

            title =
                file.name
                    .replace(/\.[^/.]+$/, "")
                    .replace(/[_-]/g, " ")
                    .replace(/\b\w/g, letter =>
                        letter.toUpperCase()
                    );

            description =
                "Beautiful Mehndi Design";
        }

        const { data: urlData } =
            supabaseClient
                .storage
                .from("mehndi-images")
                .getPublicUrl(file.name);

        const card =
            document.createElement("div");

        card.className =
            "premium-gallery-card";

        card.dataset.category =
            category;

        card.dataset.title =
            title.toLowerCase();

        card.innerHTML = `

            <div class="premium-gallery-image">

                <img
                    src="${urlData.publicUrl}"
                    alt="${title}"
                    loading="lazy"
                >

                <button
                    class="gallery-heart"
                    type="button"
                    onclick="
                        this.innerHTML =
                        this.innerHTML === '♡'
                        ? '♥'
                        : '♡'
                    "
                >
                    ♡
                </button>

                <button
                    class="gallery-view-btn"
                    type="button"
                    
                         onclick="openDesignModal('${category}')"
                >
                    View Design →
                </button>

            </div>

            <div class="premium-gallery-info">

                <h3>${title}</h3>

                <p>${description}</p>

                <div class="gallery-leaf">
                    ❧
                </div>

            </div>

        `;

        gallery.appendChild(card);

    });

    setupGalleryFilters();
}


// ================= FILTER + SEARCH =================

function setupGalleryFilters() {

    const buttons =
        document.querySelectorAll(".gallery-filter");

    const search =
        document.getElementById("gallerySearch");

    const cards =
        document.querySelectorAll(
            ".premium-gallery-card"
        );


    buttons.forEach(button => {

        button.addEventListener(
            "click",
            function () {

                buttons.forEach(btn =>
                    btn.classList.remove("active")
                );

                this.classList.add("active");

                const filter =
                    this.dataset.filter;

                cards.forEach(card => {

                    if (
                        filter === "all" ||
                        card.dataset.category === filter
                    ) {

                        card.style.display = "";

                    } else {

                        card.style.display = "none";

                    }

                });

            }
        );

    });


    if (search) {

        search.addEventListener(
            "input",
            function () {

                const value =
                    this.value
                        .toLowerCase()
                        .trim();

                cards.forEach(card => {

                    const title =
                        card.dataset.title;

                    if (title.includes(value)) {

                        card.style.display = "";

                    } else {

                        card.style.display = "none";

                    }

                });

            }
        );

    }

}


// ================= START GALLERY =================

loadPublicGallery();
function openDesignModal(category) {

    const modal = document.getElementById("designModal");
    const grid = modal.querySelector(".design-photo-grid");
    const title = modal.querySelector("h2");

    // Arabic Mehndi
    if (category === "arabic") {

        title.innerHTML = "🌿 Arabic Mehndi Designs";

        grid.innerHTML = `
            <img src="images/Arabic mehndi 1.jpg" alt="Arabic Mehndi Design">
            <img src="images/Arabic mehndi 2.jpg" alt="Arabic Mehndi Design">
            <img src="images/Arabic mehndi 3.jpg" alt="Arabic Mehndi Design">

            <img src="images/Arabic mehndi 4.webp" alt="Arabic Mehndi Design">
            <img src="images/Arabic mehndi 5.webp" alt="Arabic Mehndi Design">
            <img src="images/Arabic mehndi 6.webp" alt="Arabic Mehndi Design">
            <img src="images/Arabic mehndi 7.webp" alt="Arabic Mehndi Design">
            <img src="images/Arabic mehndi 8.webp" alt="Arabic Mehndi Design">
            <img src="images/Arabic mehndi 9.webp" alt="Arabic Mehndi Design">
            <img src="images/Arabic mehndi 10.webp" alt="Arabic Mehndi Design">
            <img src="images/Arabic mehndi 11.webp" alt="Arabic Mehndi Design">
            <img src="images/Arabic mehndi 12.webp" alt="Arabic Mehndi Design">
            <img src="images/Arabic mehndi 13.webp" alt="Arabic Mehndi Design">
            <img src="images/Arabic mehndi 14.webp" alt="Arabic Mehndi Design">
            <img src="images/Arabic mehndi 15.webp" alt="Arabic Mehndi Design">
            <img src="images/Arabic mehndi 16.webp" alt="Arabic Mehndi Design">
            <img src="images/Arabic mehndi 17.webp" alt="Arabic Mehndi Design">
            <img src="images/Arabic mehndi 18.webp" alt="Arabic Mehndi Design">
            <img src="images/Arabic mehndi 19.webp" alt="Arabic Mehndi Design">
            <img src="images/Arabic mehndi 20.webp" alt="Arabic Mehndi Design">
        `;

    

   } else if (category === "simple") {

    title.innerHTML = "🌸 Simple Mehndi Designs";

    grid.innerHTML = `
        <img src="images/Simple mehndi 1.webp" alt="Simple Mehndi Design">
        <img src="images/Simple mehndi 2.webp" alt="Simple Mehndi Design">
        <img src="images/Simple mehndi 3.webp" alt="Simple Mehndi Design">
        <img src="images/Simple mehndi 4.webp" alt="Simple Mehndi Design">
        <img src="images/Simple mehndi 5.webp" alt="Simple Mehndi Design">
        <img src="images/Simple mehndi 6.webp" alt="Simple Mehndi Design">
        <img src="images/Simple mehndi 7.webp" alt="Simple Mehndi Design">
        <img src="images/Simple mehndi 8.webp" alt="Simple Mehndi Design">
        <img src="images/Simple mehndi 9.jpg" alt="Simple Mehndi Design">
        <img src="images/Simple mehndi 10.jpg" alt="Simple Mehndi Design">
        <img src="images/Simple mehndi 11.webp" alt="Simple Mehndi Design">
        <img src="images/Simple mehndi 12.webp" alt="Simple Mehndi Design">
        <img src="images/Simple mehndi 13.webp" alt="Simple Mehndi Design">
        <img src="images/Simple mehndi 14.webp" alt="Simple Mehndi Design">
        <img src="images/Simple mehndi 15.webp" alt="Simple Mehndi Design">
        <img src="images/Simple mehndi 16.webp" alt="Simple Mehndi Design">
        <img src="images/Simple mehndi 17.webp" alt="Simple Mehndi Design">
        <img src="images/Simple mehndi 18.webp" alt="Simple Mehndi Design">
        <img src="images/Simple mehndi 19.webp" alt="Simple Mehndi Design">
        <img src="images/Simple mehndi 20.webp" alt="Simple Mehndi Design">
    `;
} else if (category === "wedding") {

    title.innerHTML = "💍 Wedding Mehndi Designs";

    grid.innerHTML = `
        <img src="images/Wedding mehndi 1.jpg" alt="Wedding Mehndi Design">
        <img src="images/Wedding mehndi 2.jpeg" alt="Wedding Mehndi Design">
        <img src="images/Wedding mehndi 3.webp" alt="Wedding Mehndi Design">
        <img src="images/Wedding mehndi 4.webp" alt="Wedding Mehndi Design">
        <img src="images/Wedding mehndi 5.webp" alt="Wedding Mehndi Design">
        <img src="images/Wedding mehndi 6.webp" alt="Wedding Mehndi Design">
        <img src="images/Wedding mehndi 7.webp" alt="Wedding Mehndi Design">
        <img src="images/Wedding mehndi 8.webp" alt="Wedding Mehndi Design">
        <img src="images/Wedding mehndi 9.webp" alt="Wedding Mehndi Design">
        <img src="images/Wedding mehndi 10.webp" alt="Wedding Mehndi Design">
        <img src="images/Wedding mehndi 11.webp" alt="Wedding Mehndi Design">
        <img src="images/Wedding mehndi 12.webp" alt="Wedding Mehndi Design">
        <img src="images/Wedding mehndi 13.webp" alt="Wedding Mehndi Design">
        <img src="images/Wedding mehndi 14.webp" alt="Wedding Mehndi Design">
        <img src="images/Wedding mehndi 15.webp" alt="Wedding Mehndi Design">
        <img src="images/Wedding mehndi 16.webp" alt="Wedding Mehndi Design">
        <img src="images/Wedding mehndi 17.webp" alt="Wedding Mehndi Design">
        <img src="images/Wedding mehndi 18.webp" alt="Wedding Mehndi Design">
        <img src="images/Wedding mehndi 19.webp" alt="Wedding Mehndi Design">
        <img src="images/Wedding mehndi 20.webp" alt="Wedding Mehndi Design">
    `;

}


    modal.style.display = "block";
    document.body.style.overflow = "hidden";
}
        


function closeDesignModal() {
    document.getElementById("designModal").style.display = "none";
    document.body.style.overflow = "";
}

window.addEventListener("click", function(event) {
    const modal = document.getElementById("designModal");

    if (event.target === modal) {
        closeDesignModal();
    }
});

// ===== FIX PUBLIC GALLERY =====

async function loadGallery() {

    const message =
        document.getElementById("galleryMessage");

    const container =
    document.getElementById("publicGallery");
    if (!message || !container) {
        return;
    }

    message.style.display = "block";
    message.textContent = "Gallery load ho rahi hai...";

    const { data, error } =
        await supabaseClient
            .storage
            .from("mehndi-images")
            .list("", {
                limit: 100,
                sortBy: {
                    column: "name",
                    order: "asc"
                }
            });

    if (error) {

        console.error("Gallery Load Error:", error);

        message.style.display = "block";
        message.textContent =
            "❌ Gallery load nahi ho paayi.";

        return;
    }

    container.innerHTML = "";

    if (!data || data.length === 0) {

        message.style.display = "block";
        message.textContent =
            "📷 Abhi gallery mein koi design nahi hai.";

        return;
    }

    message.style.display = "none";

    data.forEach(file => {

        if (
            !file.name ||
            file.name === ".emptyFolderPlaceholder"
        ) {
            return;
        }

        const { data: urlData } =
            supabaseClient
                .storage
                .from("mehndi-images")
                .getPublicUrl(file.name);

        const card =
            document.createElement("div");

        card.className = "gallery-card";

        card.innerHTML = `
            <img
                src="${urlData.publicUrl}"
                alt="Mehndi Design"
                loading="lazy"
            >
        `;

        container.appendChild(card);
    });
}

// Gallery automatically load
document.addEventListener("DOMContentLoaded", function () {
    loadGallery();
});
// =========================================
// GALLERY IMAGE ZOOM VIEWER
// =========================================

// =========================================
// PROFESSIONAL GALLERY IMAGE VIEWER
// =========================================

document.addEventListener("click", function (event) {

    const image = event.target.closest(
        ".premium-gallery-card img, .gallery-card img, #designModal .design-photo-grid img"
    );

    if (!image) return;

    event.stopPropagation();

    const viewer = document.createElement("div");
    viewer.className = "image-zoom-viewer";

    viewer.innerHTML = `
        <button class="image-zoom-close" type="button">×</button>

        <div class="image-zoom-stage">
            <img
                class="image-zoom-photo"
                src="${image.src}"
                alt="${image.alt || "Mehndi Design"}"
                draggable="false"
            >
        </div>

        <div class="zoom-controls">
            <button type="button" class="zoom-minus">−</button>
            <button type="button" class="zoom-reset">Reset</button>
            <button type="button" class="zoom-plus">+</button>
        </div>
    `;

    document.body.appendChild(viewer);
    document.body.style.overflow = "hidden";

    const photo = viewer.querySelector(".image-zoom-photo");
    const stage = viewer.querySelector(".image-zoom-stage");

    let scale = 1;
    let x = 0;
    let y = 0;

    let startX = 0;
    let startY = 0;

    let startDistance = 0;
    let startScale = 1;

    let dragging = false;

    function updateImage() {
        photo.style.transform =
            `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
    }

    function resetZoom() {
        scale = 1;
        x = 0;
        y = 0;
        updateImage();
    }

    function closeViewer() {
        viewer.remove();
        document.body.style.overflow = "";
    }

    // + button
    viewer.querySelector(".zoom-plus").addEventListener("click", function (e) {
        e.stopPropagation();

        scale = Math.min(scale + 0.5, 4);
        updateImage();
    });

    // - button
    viewer.querySelector(".zoom-minus").addEventListener("click", function (e) {
        e.stopPropagation();

        scale = Math.max(scale - 0.5, 1);

        if (scale === 1) {
            x = 0;
            y = 0;
        }

        updateImage();
    });

    // Reset
    viewer.querySelector(".zoom-reset").addEventListener("click", function (e) {
        e.stopPropagation();
        resetZoom();
    });

    // Mouse wheel zoom
    stage.addEventListener("wheel", function (e) {

        e.preventDefault();

        if (e.deltaY < 0) {
            scale = Math.min(scale + 0.25, 4);
        } else {
            scale = Math.max(scale - 0.25, 1);
        }

        if (scale === 1) {
            x = 0;
            y = 0;
        }

        updateImage();

    }, { passive: false });

    // Mouse / touch drag
    stage.addEventListener("pointerdown", function (e) {

        if (e.pointerType === "mouse" && e.button !== 0) return;

        dragging = true;

        startX = e.clientX - x;
        startY = e.clientY - y;

        stage.setPointerCapture(e.pointerId);
    });

    stage.addEventListener("pointermove", function (e) {

        if (!dragging) return;

        x = e.clientX - startX;
        y = e.clientY - startY;

        updateImage();
    });

    stage.addEventListener("pointerup", function () {
        dragging = false;
    });

    stage.addEventListener("pointercancel", function () {
        dragging = false;
    });

    // Double click zoom
    photo.addEventListener("dblclick", function (e) {

        e.stopPropagation();

        if (scale === 1) {
            scale = 2;
        } else {
            resetZoom();
        }

        updateImage();
    });

    // Close button
    viewer.querySelector(".image-zoom-close")
        .addEventListener("click", function () {
            closeViewer();
        });

    // Click outside image = close
    viewer.addEventListener("click", function (e) {

        if (e.target === viewer) {
            closeViewer();
        }

    });

});




async function renderFestivalOffers() {
  const grid = document.getElementById("festivalOffersGrid");
  if (!grid) return;

  grid.innerHTML = "<p>Loading festival offers...</p>";

  const { data, error } = await supabaseClient
    .from("festival_offers")
    .select("*")
    .eq("price_enabled", true)
    .order("festival_date", { ascending: true });
console.log("Festival data:", data);
console.log("Festival error:", error);
  if (error) {
    console.error("Festival offers error:", error);
    grid.innerHTML = "<p>Festival offers abhi load nahi ho paaye.</p>";
    return;
  }

  const today = new Date();
  const todayString =
    today.getFullYear() + "-" +
    String(today.getMonth() + 1).padStart(2, "0") + "-" +
    String(today.getDate()).padStart(2, "0");

 const activeFestivals = (data || []).filter(festival => {
  const festivalDate = new Date(
    festival.festival_date + "T00:00:00"
  );

  const offerStart = new Date(
    festival.offer_start + "T00:00:00"
  );

  const offerEnd = new Date(
    festival.offer_end + "T23:59:59"
  );

  const todayDate = new Date();
  todayDate.setHours(0, 0, 0, 0);

  const daysUntilFestival = Math.ceil(
    (festivalDate - todayDate) / (1000 * 60 * 60 * 24)
  );

  return (
    daysUntilFestival >= 0 &&
    daysUntilFestival <= 10 &&
    todayDate >= offerStart &&
    todayDate <= offerEnd
  );
});

  if (activeFestivals.length === 0) {
    grid.innerHTML = `
      <div class="festival-offer-card">
        <h3>No Festival Offer Right Now</h3>
        <p>Check back for upcoming festival offers.</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = activeFestivals.map(festival => `
    <div class="festival-offer-card">
      <h3>${festival.festival_name} Special</h3>
      <p>Enjoy ${festival.discount_percent}% OFF on all mehndi packages!</p>
      <p>Valid till ${festival.offer_end}</p>
      <a href="#booking" class="offer-book-btn">Book Now</a>
    </div>
  `).join("");
  
// Apply active festival discount to all packages
document.querySelectorAll(".package-price[data-original-price]").forEach(p => {
    if (!p.classList.contains("festival-discount")) {
        p.querySelector(".discounted-price").textContent = "";
    }
});
const TEST_DISCOUNT = false;
const activeDiscount = Math.max(
    0,
    ...activeFestivals.map(festival =>
        Number(festival.discount_percent) || 0
    )
);
const discountToApply = TEST_DISCOUNT ? 20 : activeDiscount;
document.querySelectorAll(".package-price[data-original-price]").forEach(priceElement => {
    console.log("Discount code running");
    const originalPrice = Number(priceElement.dataset.originalPrice);
    const originalLabel = priceElement.querySelector(".original-price");
    const discountedLabel = priceElement.querySelector(".discounted-price");

    if (!originalLabel || !discountedLabel || !originalPrice) return;

    if (discountToApply > 0) {
        const discountedPrice = Math.round(
            originalPrice * (1 - discountToApply / 100)
        );

        originalLabel.textContent = `₹${originalPrice.toLocaleString("en-IN")}+`;
        discountedLabel.textContent = `₹${discountedPrice.toLocaleString("en-IN")}+`;
        priceElement.classList.add("festival-discount");
    } else {
        originalLabel.textContent = `₹${originalPrice.toLocaleString("en-IN")}+`;
        discountedLabel.textContent = "";
        priceElement.classList.remove("festival-discount");
    }
});

}
renderFestivalOffers();
