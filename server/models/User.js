//데이터베이스 모델을 정의하는 파일
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  username: { type: String, required: true },
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (this.isModified('password') || this.isNew) {
    console.log('비밀번호 해싱 전:', this.password);
    try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
      console.log('해시된 비밀번호:', this.password); // 로그 추가
    } catch (error) {
      return next(error);
    }
  }
  next();
});

// Compare password
userSchema.methods.comparePassword = async function(enteredPassword) {
  try {
    const isMatch = await bcrypt.compare(enteredPassword, this.password);
    console.log('입력된 비밀번호:', enteredPassword);
    console.log('해싱된 비밀번호:', this.password);
    console.log('비밀번호 비교 결과:', isMatch);
    return isMatch;
  } catch (error) {
    console.error('비밀번호 비교 오류:', error);
    return false;
  }
};

module.exports = mongoose.model('User', userSchema);
