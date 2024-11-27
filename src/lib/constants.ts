export class Constants {
  static ACCESS_TOKEN = "accessToken";
  static REFRESH_TOKEN = "refreshToken";

  static INPUT_TYPE = {
    TEXT: "text",
    EMAIL: "email",
    PASSWORD: "password",
    CHECKBOX: "checkbox",
    CIRCLE_CHECKBOX: "circle_checkbox",
    SELECT: "select",
    TEXTAREA: "textarea",
    DATE_PICKER: "date_picker",
    MONTH_RANGE_PICKER: "month_range_picker",
    EDITOR: "editor",
    FILE_UPLOAD: "file",
    RADIO: "radio",
    INPUT_CHECK: "input_check",
    RE_CAPTCHA: "re_captcha",
    AVATAR: "avatar",
    FILE_UPLOAD_PRESIGNED: "file_presigned",
    NUMBER: "number",
  };

  static DEFAULT_PAGESIZE = 6;

  static ROLE = {
    ADMIN: 1,
    USER: 10,
  };

  static PAGINATION = {
    LIMIT: 6,
    SIBLING_COUNT: 8,
  };

  static SidebarNavItems = [
    // {
    //   href: routerPaths.ADMIN_SETS,
    //   title: 'Sets',
    // },
    // {
    //   href: routerPaths.ADMIN_PENDING_SETS,
    //   title: 'Pending Sets',
    // },
    // {
    //   href: routerPaths.ADMIN_SETS_MULTIPLE_CHOICE_TEST,
    //   title: 'Tests',
    // },
  ];

  static TransactionType = [
    {
      key: "Chi",
      label: "Chi",
    },
    { key: "Thu", label: "Thu" },
  ];
  static TRANSACTION_TYPE = {
    THU: "Thu",
    CHI: "Chi",
  };
  static MockCategories = [
    { key: "Tien an", label: "Tien an" },
    { key: "Tien luong", label: "Tien luong" },
    { key: "Tien hoc", label: "Tien hoc" },
    { key: "Tien tro", label: "Tien tro" },
  ];
}
