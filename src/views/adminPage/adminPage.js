import * as Api from '../api.js';

const setMain = document.querySelector('.setMain');
const privacy = document.querySelector('#privacy');
const profile_img = document.querySelector('.profile_img');
const product = document.querySelector('#product');
const order = document.querySelector('#order');

let profileData = {};

// 처음 로딩시 내 정보 페이지 출력
patchProfileData();
async function patchProfileData() {
  try {
        const { user } = await Api.get('/api/users?email=' + sessionStorage.getItem("email"));

        profileData = {
            id: user._id,
            name: user.fullName,
            email: user.email,
            phone: user.phoneNumber,
        }
        console.log(profileData);
        myProfile();
    } catch (error) {
        console.error('Error fetching profile data:', error);
    }
}

// 내 정보 페이지 출력 함수
function myProfile() {
    setMain.innerHTML = `
    <form>
        <label for="name">이름:</label>
        ${profileData.name}
        <br><br>
        <label for="email">이메일:</label>
        ${profileData.email}
        <br><br>
        <label for="address">주소:</label>
        ${profileData.address}
        <br><br>
        <label for="phone">전화번호:</label>
        ${profileData.phone}
    </form>`;
}

// 프로필 이벤트
profile_img.addEventListener('click', (e) => {
    e.preventDefault();
    myProfile();
});

// 개인정보 수정 이벤트
privacy.addEventListener('click', (e) => {
    e.preventDefault();
    setMain.innerHTML = `
    <form id="editProfileForm" onsubmit="saveProfile(event)">
        <h1>회원정보 수정</h1>
        <div class="form-group">
            <label for="name">이름</label>
            <input type="text" id="name" name="name" value="${profileData.name}" placeholder="이름을 입력하세요">
        </div>
        <div class="form-group">
            <label for="address">주소</label>
            <input type="text" id="address" name="address" value="${profileData.address}" placeholder="주소를 입력하세요">
        </div>
        <div class="form-group">
            <label for="phone">전화번호</label>
            <input type="text" id="phone" name="phone" value="${profileData.phone}" placeholder="전화번호를 입력하세요">
        </div>
        <div class="form-group">
            <label for="password">비밀번호</label>
            <input type="password" id="password" name="password" placeholder="비밀번호를 입력하세요">
        </div>
        <div class="form-group">
            <label for="confirm_password">비밀번호 확인</label>
            <input type="password" id="confirm_password" name="confirm_password" placeholder="비밀번호를 다시 입력하세요">
        </div>
        <button type="submit">저장</button>
    </form>
    `;

    document.getElementById('editProfileForm').addEventListener('submit', saveProfile)
});

// 개인정보 수정 저장 함수
async function saveProfile(e) {
    e.preventDefault();

    // const form = document.getElementById('editProfileForm');
    // const formData = new FormData(form);

    // const name = formData.get("name");

    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const password = document.getElementById('password').value;
    const confirm_password = document.getElementById('confirm_password').value;

    // 비밀번호 확인
    if (password || confirm_password) {
        if (password !== confirm_password) {
            alert('비밀번호가 일치하지 않습니다.');
            return;
        }
        
        if (password.length < 4) {
            alert('비밀번호는 최소 4자 이상이어야 합니다.');
            return;
        }
    }

    // 수정한 데이터 저장(이메일은 그대로, 비밀번호는 수정한 경우에만 변경 후 저장)
    const updatedProfileData = {
        userId: profileData.id,
        fullName: name,
        email: profileData.email,
        phoneNumber: phone,
    };

    if (password) {
        updatedProfileData.currentPassword = password;
    }


    try {
        const { user } = await Api.patch('/api/users', '', updatedProfileData);

        profileData = {
            id: user._id,
            name: user.fullName,
            email: user.email,
            phone: user.phoneNumber,
        }

        myProfile();
    } catch (error) {
        console.error('Error updating profile data:', error);
    }
}

// 상품 추가, 수정, 삭제 이벤트
product.addEventListener('click', (e) => {
    e.preventDefault();
    setMain.innerHTML = `
    <form class="product">
        <div class="container">
        <h2>등록된 상품</h2>
        <div class="category">
            <div class="product">
                <span>상품 1</span>
                <button class="edit-button">수정</button>
                <button class="delete-button">삭제</button>
            </div>
            <div class="product">
                <span>상품 2</span>
                <button class="edit-button">수정</button>
                <button class="delete-button">삭제</button>
            </div>
            <div class="product">
                <span>상품 3</span>
                <button class="edit-button">수정</button>
                <button class="delete-button">삭제</button>
            </div>
            <div class="product">
                <span>상품 4</span>
                <button class="edit-button">수정</button>
                <button class="delete-button">삭제</button>
            </div>
        </div>
    </div>
    `
})

// 주문조회, 취소 이벤트
order.addEventListener('click', (e) => {
    e.preventDefault();
    setMain.innerHTML = ``
})
