import { type Locale } from "./config";

export type Dictionary = {
    metadata: {
        title: string;
        description: string;
        siteName: string;
    };
    errors: {
        notAuthenticated: string;
        displayNameLength: string;
    };
    ui: {
        headerTitle: string;
        blogHeading: string;
        moreStories: string;
        alertTextPrefix: string;
        alertLinkLabel: string;
        postsInCategory: string;
        footerPrimaryCta: string;
        footerSecondaryCta: string;
        languageLabel: string;
        languageOptionVietnamese: string;
        languageOptionEnglish: string;
        themeSystem: string;
        themeDark: string;
        themeLight: string;
        musicPlay: string;
        musicPause: string;
        musicExpand: string;
        musicCollapse: string;
        musicPrevious: string;
        musicNext: string;
        musicMinimize: string;
        musicRestore: string;
        profilePageHeading: string;
        profilePageMetaTitle: string;
        profileDisplayNameLabel: string;
        profileEmailHint: string;
        profileSave: string;
        profileSaving: string;
        profileSaved: string;
        commentsSignInToComment: string;
        commentsTitle: string;
        commentsEmpty: string;
        commentsWritePlaceholder: string;
        commentsReplyPlaceholder: string;
        commentsPost: string;
        commentsPosting: string;
        commentsCancel: string;
        headerMenuOpenAria: string;
        headerMenuTheme: string;
        headerMenuSignIn: string;
        headerMenuSignUp: string;
        headerMenuSignOut: string;
        headerMenuProfile: string;
        authTabLogin: string;
        authTabRegister: string;
        authCloseAria: string;
        authPlaceholderDisplayName: string;
        authPlaceholderEmail: string;
        authPlaceholderPassword: string;
        authSubmitLogin: string;
        authSubmitRegister: string;
        authSubmitWait: string;
        authDividerOr: string;
        authGoogleCta: string;
        authRegisterSuccess: string;
        authGoogleStartError: string;
        commentsAnonymous: string;
        commentsReply: string;
        commentsDelete: string;
        commentsDeleteCommentAria: string;
        commentsDeleteReplyAria: string;
        profileEmailFieldLabel: string;
    };
};

export type AuthModalLabels = {
    tabLogin: string;
    tabRegister: string;
    closeAria: string;
    placeholderDisplayName: string;
    placeholderEmail: string;
    placeholderPassword: string;
    submitLogin: string;
    submitRegister: string;
    submitWait: string;
    dividerOr: string;
    googleCta: string;
    registerSuccess: string;
    googleStartError: string;
};

export function getAuthModalLabels(d: Dictionary): AuthModalLabels {
    const u = d.ui;
    return {
        tabLogin: u.authTabLogin,
        tabRegister: u.authTabRegister,
        closeAria: u.authCloseAria,
        placeholderDisplayName: u.authPlaceholderDisplayName,
        placeholderEmail: u.authPlaceholderEmail,
        placeholderPassword: u.authPlaceholderPassword,
        submitLogin: u.authSubmitLogin,
        submitRegister: u.authSubmitRegister,
        submitWait: u.authSubmitWait,
        dividerOr: u.authDividerOr,
        googleCta: u.authGoogleCta,
        registerSuccess: u.authRegisterSuccess,
        googleStartError: u.authGoogleStartError,
    };
}

const dictionaries: Record<Locale, Dictionary> = {
    vi: {
        metadata: {
            title: "Blog của Huỳnh Thành Nam",
            description: "Đây là blog nơi mình chia sẻ suy nghĩ và trải nghiệm sống.",
            siteName: "Blog của Huỳnh Thành Nam",
        },
        errors: {
            notAuthenticated: "Bạn chưa đăng nhập.",
            displayNameLength: "Tên hiển thị phải có từ {min} đến {max} ký tự.",
        },
        ui: {
            headerTitle: "Blog",
            blogHeading: "Blog.",
            moreStories: "Bài viết khác",
            alertTextPrefix: "Đây là blog của mình. Bạn cũng có thể xem thêm",
            alertLinkLabel: "website Let's Live",
            postsInCategory: "Bài viết trong chủ đề:",
            footerPrimaryCta: "Ghé thăm website Let's Live của mình",
            footerSecondaryCta: "Theo dõi mình trên Instagram",
            languageLabel: "Ngôn ngữ",
            languageOptionVietnamese: "Tiếng Việt",
            languageOptionEnglish: "English",
            themeSystem: "Hệ thống",
            themeDark: "Tối",
            themeLight: "Sáng",
            musicPlay: "Phát",
            musicPause: "Tạm dừng",
            musicExpand: "Mở rộng trình phát nhạc",
            musicCollapse: "Thu gọn trình phát nhạc",
            musicPrevious: "Bài trước",
            musicNext: "Bài sau",
            musicMinimize: "Thu nhỏ trình phát xuống góc màn hình",
            musicRestore: "Mở lại trình phát nhạc",
            profilePageHeading: "Hồ sơ",
            profilePageMetaTitle: "Chỉnh sửa hồ sơ",
            profileDisplayNameLabel: "Tên hiển thị",
            profileEmailHint: "Email đăng nhập không thể đổi tại đây.",
            profileSave: "Lưu",
            profileSaving: "Đang lưu…",
            profileSaved: "Đã lưu.",
            commentsSignInToComment: "Đăng nhập để bình luận",
            commentsTitle: "Bình luận",
            commentsEmpty: "Chưa có bình luận nào. Hãy là người đầu tiên!",
            commentsWritePlaceholder: "Viết bình luận…",
            commentsReplyPlaceholder: "Trả lời {name}…",
            commentsPost: "Đăng",
            commentsPosting: "Đang đăng…",
            commentsCancel: "Hủy",
            headerMenuOpenAria: "Mở menu trang",
            headerMenuTheme: "Giao diện",
            headerMenuSignIn: "Đăng nhập",
            headerMenuSignUp: "Đăng ký",
            headerMenuSignOut: "Đăng xuất",
            headerMenuProfile: "Hồ sơ",
            authTabLogin: "Đăng nhập",
            authTabRegister: "Đăng ký",
            authCloseAria: "Đóng",
            authPlaceholderDisplayName: "Tên hiển thị",
            authPlaceholderEmail: "Email",
            authPlaceholderPassword: "Mật khẩu",
            authSubmitLogin: "Đăng nhập",
            authSubmitRegister: "Tạo tài khoản",
            authSubmitWait: "Đang xử lý…",
            authDividerOr: "hoặc",
            authGoogleCta: "Tiếp tục với Google",
            authRegisterSuccess: "Đã tạo tài khoản! Kiểm tra email để xác nhận, rồi đăng nhập.",
            authGoogleStartError: "Không thể bắt đầu đăng nhập Google. Vui lòng thử lại.",
            commentsAnonymous: "Ẩn danh",
            commentsReply: "Trả lời",
            commentsDelete: "Xóa",
            commentsDeleteCommentAria: "Xóa bình luận",
            commentsDeleteReplyAria: "Xóa phản hồi",
            profileEmailFieldLabel: "Email",
        },
    },
    en: {
        metadata: {
            title: "Blog of Huỳnh Thành Nam",
            description: "This is my blog where I share my thoughts and life experiences.",
            siteName: "Blog of Huỳnh Thành Nam",
        },
        errors: {
            notAuthenticated: "You are not signed in.",
            displayNameLength: "Display name must be between {min} and {max} characters.",
        },
        ui: {
            headerTitle: "Blog",
            blogHeading: "Blog.",
            moreStories: "More Stories",
            alertTextPrefix: "This is my blog. You can also check out my",
            alertLinkLabel: "Let's Live website",
            postsInCategory: "Posts in:",
            footerPrimaryCta: "Visit my Let's Live website",
            footerSecondaryCta: "Follow me on Instagram",
            languageLabel: "Language",
            languageOptionVietnamese: "Tiếng Việt",
            languageOptionEnglish: "English",
            themeSystem: "System",
            themeDark: "Dark",
            themeLight: "Light",
            musicPlay: "Play",
            musicPause: "Pause",
            musicExpand: "Expand music player",
            musicCollapse: "Collapse music player",
            musicPrevious: "Previous track",
            musicNext: "Next track",
            musicMinimize: "Minimize player to corner",
            musicRestore: "Restore music player",
            profilePageHeading: "Profile",
            profilePageMetaTitle: "Edit profile",
            profileDisplayNameLabel: "Display name",
            profileEmailHint: "Sign-in email cannot be changed here.",
            profileSave: "Save",
            profileSaving: "Saving…",
            profileSaved: "Saved.",
            commentsSignInToComment: "Sign in to comment",
            commentsTitle: "Comments",
            commentsEmpty: "No comments yet. Be the first!",
            commentsWritePlaceholder: "Write a comment…",
            commentsReplyPlaceholder: "Reply to {name}…",
            commentsPost: "Post",
            commentsPosting: "Posting…",
            commentsCancel: "Cancel",
            headerMenuOpenAria: "Open site menu",
            headerMenuTheme: "Theme",
            headerMenuSignIn: "Sign in",
            headerMenuSignUp: "Sign up",
            headerMenuSignOut: "Sign out",
            headerMenuProfile: "Profile",
            authTabLogin: "Login",
            authTabRegister: "Register",
            authCloseAria: "Close",
            authPlaceholderDisplayName: "Display name",
            authPlaceholderEmail: "Email",
            authPlaceholderPassword: "Password",
            authSubmitLogin: "Login",
            authSubmitRegister: "Create account",
            authSubmitWait: "Please wait…",
            authDividerOr: "or",
            authGoogleCta: "Continue with Google",
            authRegisterSuccess: "Account created! Check your email to confirm, then log in.",
            authGoogleStartError: "Could not start Google sign in. Please try again.",
            commentsAnonymous: "Anonymous",
            commentsReply: "Reply",
            commentsDelete: "Delete",
            commentsDeleteCommentAria: "Delete comment",
            commentsDeleteReplyAria: "Delete reply",
            profileEmailFieldLabel: "Email",
        },
    },
};

export function getDictionary(locale: Locale): Dictionary {
    return dictionaries[locale];
}
