let CardUtil = {};
CardUtil.cardGrade = {
    3: 1,
    4: 2,
    5: 3,
    6: 4,
    7: 5,
    8: 6,
    9: 7,
    10: 8,
    J: 9,
    Q: 10,
    K: 11,
    A: 12,
    2: 13,
    g: 14,
    G: 15
};
CardUtil.gradeDown = function (card1, card2) {
    return CardUtil.cardGrade[card2.showTxt] - CardUtil.cardGrade[card1.showTxt];
};
CardUtil.gradeup = function (card1, card2) {
    return CardUtil.cardGrade[card1.showTxt] - CardUtil.cardGrade[card2.showTxt];
};
module.exports = CardUtil;