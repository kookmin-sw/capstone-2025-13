package kr.ac.kookmin.wuung.service;

import kr.ac.kookmin.wuung.repository.RecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
class RecordService(
    @Autowired val recordRepository : RecordRepository
) {

}