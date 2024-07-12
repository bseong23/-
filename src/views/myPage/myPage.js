import * as Api from '../api.js';

const privacy = document.querySelector('#privacy');
const order = document.querySelector('#order');
const resign = document.querySelector('#resign');
const setMain = document.querySelector('.setMain');
const profile_img = document.querySelector('.profile_img');

let profileData = {};

// 처음 로딩시 내 정보 페이지 출력
patchProfileData();
async function patchProfileData() {
  try {
        const { user } = await Api.get('/api/users');
        
        profileData = {
            id: user._id,
            name: user.fullName,
            email: user.email,
            phoneNumber: user.phoneNumber,
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
        
        <label for="phone">전화번호:</label>
        ${profileData.phoneNumber}
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

//주문내역 이벤트
order.addEventListener('click', (e) => {
    e.preventDefault();
    setMain.innerHTML = `
    <form id="orderHistory">
        <h1>주문 내역</h1>
        <div class="orderList">
            <div class="order">
                <div class="orderInfo">
                    <p>주문번호: 202108030001</p>
                    <p>주문일자: 2021-08-03</p>
                    <p>주문상품: 삼성 갤럭시 노트북</p>
                    <p>주문금액: 1,500,000원</p>
                    <p>주문상태: 배송중</p>
                </div>
                <button type="button">주문 상세보기</button>
            </div>
            <div class="order">
                <div class="orderInfo">
                    <p>주문번호: 202108030002</p>
                    <p>주문일자: 2021-08-03</p>
                    <p>주문상품: LG 그램 노트북</p>
                    <p>주문금액: 1,800,000원</p>
                    <p>주문상태: 배송완료</p>
                </div>
                <button type="button">주문 상세보기</button>
            </div>
        </div>
    </form>`;
})


//회원탈퇴 함수
async function deleteProfile(e) {
    e.preventDefault();
    const confirmDelete = confirm('정말로 프로필을 삭제하시겠습니까?');
    if (!confirmDelete) {
        return;
    }

    try {
        await Api.delete('/api/users', '', { email: document.getElementById('email').value, password: document.getElementById('password').value});
        alert('프로필이 삭제되었습니다.');
        setMain.innerHTML = '<p>프로필이 삭제되었습니다.</p>';
    } catch (error) {
        console.error('Error deleting profile:', error);
    }
    sessionStorage.clear();
    window.location.href = "../home/home.html";
}

//회원탈퇴 이벤트
resign.addEventListener('click', (e) => {
    e.preventDefault();
    setMain.innerHTML = `
    <form id="resignForm">
        <h1 id="resignHead">회원탈퇴</h1>
        <div class="form-group">
            <label for="email">이메일</label>
            <input type="text" id="email" name="email" value="${profileData.email}" placeholder="이메일을 입력하세요">
        </div>
        <div class="form-group">
            <label for="password">비밀번호</label>
            <input type="password" id="password" name="password" placeholder="비밀번호를 입력하세요">
        </div>
        <button id="resignBtn" type="button">회원 탈퇴</button>
    </form>`;
    document.getElementById('resignBtn').addEventListener('click', deleteProfile)
}
);