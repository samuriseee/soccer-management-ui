/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

import React from 'react'
import styles from './FAQSection.module.scss'
import FAQItem from './FAQItem/FAQItem';

const FAQSection = () => {
    return (
        <section className={styles.faq_section}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h2>Câu hỏi thường gặp</h2>
                    <p>
                        Những câu hỏi và thắc mắc phổ biến về dịch vụ của chúng
                        tôi
                    </p>
                </div>

                <div className={styles.faq_container}>
                    {faqs.map((faq, index) => (
                        <FAQItem
                            key={index}
                            question={faq.question}
                            answer={faq.answer}
                        />
                    ))}
                </div>
            </div>
        </section>
    )
}

export default FAQSection

const faqs = [
    {
        question: 'Làm thế nào để đặt sân bóng trên nền tảng của bạn?',
        answer: 'Để đặt sân bóng, bạn cần đăng ký tài khoản trên nền tảng của chúng tôi, sau đó tìm kiếm sân bóng phù hợp theo vị trí, thời gian và giá cả. Chọn sân và khung giờ mong muốn, tiến hành thanh toán và bạn sẽ nhận được xác nhận đặt sân qua email hoặc tin nhắn.',
    },
    {
        question: 'Tôi có thể hủy đặt sân không?',
        answer: 'Có, bạn có thể hủy đặt sân trước thời hạn quy định. Tùy vào chính sách của từng sân, bạn có thể được hoàn tiền một phần hoặc toàn bộ. Thông thường, việc hủy trước 24-48 giờ sẽ được hoàn tiền đầy đủ.',
    },
    {
        question: 'Làm thế nào để trở thành chủ sân trên nền tảng?',
        answer: 'Để trở thành chủ sân, bạn cần đăng ký tài khoản dành cho chủ sân, cung cấp thông tin chi tiết về sân bóng của bạn như địa chỉ, giá cả, tiện ích và hình ảnh. Sau khi được xác minh, sân bóng của bạn sẽ xuất hiện trên nền tảng và sẵn sàng nhận đặt sân.',
    },
    {
        question: 'Phí dịch vụ của nền tảng là bao nhiêu?',
        answer: 'Đối với người thuê sân, việc đăng ký và tìm kiếm sân bóng hoàn toàn miễn phí. Đối với chủ sân, chúng tôi thu phí hoa hồng nhỏ (khoảng 5-10%) trên mỗi giao dịch đặt sân thành công thông qua nền tảng.',
    },
    {
        question: 'Làm thế nào để tìm đối thủ hoặc đồng đội?',
        answer: "Nền tảng của chúng tôi có tính năng 'Tìm đối' cho phép bạn đăng thông tin tìm đối thủ hoặc tìm kiếm các đội đang cần người chơi. Bạn có thể lọc theo khu vực, thời gian và trình độ để tìm được đối thủ phù hợp.",
    },
]
