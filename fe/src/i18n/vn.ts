export default {
  blogName: 'Linhx\'s notes',
  tag: 'Tag',
  notfound: 'Not found',
  comment: {
    content: {
      placeholder: 'Comment không quá 500 ký tự. (Ctrl + Enter)'
    },
    name: {
      placeholder: 'Tên của bạn (tối thiểu 2 ký tự, default: Anonymous)'
    }
  },
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
    },
    lostInternet: 'Vui lòng kiểm tra lại kết nối internet!'
  },
  message: {
    comment: {
      create: {
        success: 'Cảm ơn bạn! Comment sẽ được review'
      }
    }
  }
}
