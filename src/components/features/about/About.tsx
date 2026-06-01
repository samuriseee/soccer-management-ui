/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

import React from 'react'
import styles from './About.module.scss'

const About = () => {
  return (
    <div className={styles.about_wrapper}>
      <div className={styles.about_card}>
        <h1 className={styles.about_title}>Trang giới thiệu</h1>
        <p className={styles.about_desc}>
          Chào mừng bạn đến với nền tảng đặt sân bóng đá trực tuyến hiện đại, tiện lợi và nhanh chóng nhất!
          <br />
          <br />
          Chúng tôi kết nối người chơi với các sân bóng chất lượng, hỗ trợ tìm kiếm, đặt sân, và quản lý lịch thi đấu dễ dàng.
          <br />
          <br />
          Hãy trải nghiệm và tận hưởng niềm vui bóng đá cùng chúng tôi!
        </p>
      </div>
    </div>
  )
}

export default About
