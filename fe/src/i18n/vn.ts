export default {
  error: {
    comment: {
      create: {
        forbiddenName: 'Không được sử dụng tên: Admin, Administrator, Mod, Linhx',
        parentDoesNotExist: 'Không thể reply vì comment không tồn tại',
        noteDoesNotExist: 'Không thể comment trong bài viết không tồn tại',
        nameToShort: 'Tên quá ngắn',
        captcha: 'Lỗi captcha',
      },
      list: {
        noteDoesNotExist: 'Không có comment'
      }
    },
    captcha: {
      wrong: 'Sai captcha'
    }
  },
  message: {
    comment: {
      create: {
        success: 'Cảm ơn bạn! Comment sẽ được review'
      }
    }
  }
}
