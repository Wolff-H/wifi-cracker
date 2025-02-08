export const dict_password_strategy =
{
    passwordbook: '密码本',
    digits_8: '全 8 位数字组合',
    digits_9: '全 9 位数字组合',
    digits_10: '全 10 位数字组合',
    phone_number: '全手机号组合',
    /**
     * 形如 `1a 1a 1a 1a 1a 1a 1a 1a` 表示八位字符，每位尝试全部数字和全部小写字母
     * 形如 `1aA 1aA 1a 1a 1a 1a 1a 1a` 表示八位字符，每位尝试全部数字和全部小写字母，且前两位额外尝试全部大写字母
     */
    custom: '自定义',
}