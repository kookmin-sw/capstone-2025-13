package kr.ac.kookmin.wuung.service;

import kr.ac.kookmin.wuung.repository.TopicRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
class TopicService(
    @Autowired val recordRepository : TopicRepository
) {

}