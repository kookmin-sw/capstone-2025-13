package kr.ac.kookmin.wuung.batch

import groovy.util.logging.Slf4j
import kr.ac.kookmin.wuung.model.LuckyVickyStatus
import kr.ac.kookmin.wuung.model.Record
import kr.ac.kookmin.wuung.repository.RecordRepository
import org.springframework.ai.chat.client.ChatClient
import org.springframework.batch.core.Job
import org.springframework.batch.core.Step
import org.springframework.batch.core.job.builder.JobBuilder
import org.springframework.batch.core.repository.JobRepository
import org.springframework.batch.core.step.builder.StepBuilder
import org.springframework.batch.item.ItemProcessor
import org.springframework.batch.item.ItemWriter
import org.springframework.batch.item.data.RepositoryItemReader
import org.springframework.batch.item.data.builder.RepositoryItemReaderBuilder
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.data.domain.Sort
import org.springframework.transaction.PlatformTransactionManager

@Slf4j
@Configuration
class LuckyVickyBatch(
    @Autowired private val recordRepository: RecordRepository,
    @Autowired private val chatClient: ChatClient,
    @Qualifier("getLuckyVickyPrompt") @Autowired private val luckyVickyPrompt: String,
) {
    companion object {
        private const val CHUNK_SIZE = 10
    }

    @Bean("luckyVickyJob")
    open fun luckyVickyJob(
        jobRepository: JobRepository,
        transactionManager: PlatformTransactionManager,
        processLuckyVickyStep: Step,
    ) : Job {
        return JobBuilder("luckyVickyJob", jobRepository)
            .start(processLuckyVickyStep(
                jobRepository, transactionManager
            ))
            .build()
    }

    @Bean
    open fun processLuckyVickyStep(jobRepository: JobRepository, transactionManager: PlatformTransactionManager): Step {
        return StepBuilder("processLuckyVickyStep", jobRepository)
            .chunk<Record, Record>(CHUNK_SIZE, transactionManager)
            .reader(luckyVickyFeedbackReader())
            .processor(luckyVickyFeedbackProcessor())
            .writer(luckyVickyFeedbackWriter())
            .build()
    }

    @Bean
    open fun luckyVickyFeedbackReader(): RepositoryItemReader<Record> {
        val sortKeys = hashMapOf("createdAt" to Sort.Direction.ASC)

        return RepositoryItemReaderBuilder<Record>()
            .name("recordFeedbackReader")
            .repository(recordRepository)
            .methodName("findRecordsByStatus")
            .arguments(listOf(LuckyVickyStatus.QUEUED))
            .sorts(sortKeys)
            .pageSize(10)
            .build()
    }

    @Bean
    open fun luckyVickyFeedbackProcessor(): ItemProcessor<Record, Record> {
        return ItemProcessor { record ->
            val prompt = luckyVickyPrompt.trimIndent()

            if(record.status == LuckyVickyStatus.PROCESSING || record.status == LuckyVickyStatus.COMPLETED || record.status == LuckyVickyStatus.NOFEEDBACK)
                return@ItemProcessor record

            record.status = LuckyVickyStatus.PROCESSING
            if(record.data?.isBlank() == true) {
                LuckyVickyStatus.PROCESSING_ERROR
                return@ItemProcessor record
            }

            val data = record.data ?: ""

            val aiResponse = chatClient
                .prompt(prompt)
                .user(data)
                .call()
                .content()

            record.luckyVicky = aiResponse
            record.status = LuckyVickyStatus.COMPLETED

            record
        }
    }

    @Bean
    open fun luckyVickyFeedbackWriter(): ItemWriter<Record> {
        return ItemWriter { items ->
            // 처리 완료 후 DB 업데이트, 로그 기록 등 필요한 로직 구현
            // 예시로 단순 로그 출력
            items.forEach { record ->
                println("Processed Record(LuckyVicky) id: ${record.id}")
            }
        }
    }
}
