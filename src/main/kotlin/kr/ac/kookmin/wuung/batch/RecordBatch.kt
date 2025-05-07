package kr.ac.kookmin.wuung.batch

import groovy.util.logging.Slf4j
import kr.ac.kookmin.wuung.config.ChatClientConfig
import kr.ac.kookmin.wuung.model.RecordFeedback
import kr.ac.kookmin.wuung.model.RecordFeedbackStatus
import kr.ac.kookmin.wuung.repository.RecordFeedbackRepository
import org.springframework.ai.chat.client.ChatClient
import org.springframework.ai.chat.prompt.Prompt
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
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.data.domain.Sort
import org.springframework.transaction.PlatformTransactionManager

@Slf4j
@Configuration
class RecordBatch(
    @Autowired private val recordFeedbackRepository: RecordFeedbackRepository,
    @Autowired private val chatClient: ChatClient,
    @Autowired private val recordPrompt: String
) {
    companion object {
        private const val CHUNK_SIZE = 10
    }

    @Bean
    fun recordJob(jobRepository: JobRepository, transactionManager: PlatformTransactionManager): Job {
        return JobBuilder("recordJob", jobRepository)
            .start(processRecordsStep(
                jobRepository, transactionManager
            ))
            .build()
    }

    @Bean
    fun processRecordsStep(jobRepository: JobRepository, transactionManager: PlatformTransactionManager): Step {
        return StepBuilder("processRecordStep", jobRepository)
            .chunk<RecordFeedback, RecordFeedback>(CHUNK_SIZE, transactionManager)
            .reader(recordFeedbackReader())
            .processor(recordFeedbackProcessor())
            .writer(recordFeedbackWriter())
            .build()
    }

    @Bean
    fun recordFeedbackReader(): RepositoryItemReader<RecordFeedback> {
        val sortKeys = hashMapOf("createdAt" to Sort.Direction.ASC)

        return RepositoryItemReaderBuilder<RecordFeedback>()
            .name("recordFeedbackReader")
            .repository(recordFeedbackRepository)
            .methodName("findRecordFeedbacksByStatus")
            .arguments(listOf(RecordFeedbackStatus.QUEUED))
            .sorts(sortKeys)
            .pageSize(10)
            .build()
    }

    @Bean
    fun recordFeedbackProcessor(): ItemProcessor<RecordFeedback, RecordFeedback> {
        return ItemProcessor { record ->
            val prompt = recordPrompt.trimIndent()

            if(record.status == RecordFeedbackStatus.PROCESSING || record.status == RecordFeedbackStatus.COMPLETED)
                return@ItemProcessor record

            record.status = RecordFeedbackStatus.PROCESSING
            if(record.data?.isBlank() == true) {
                RecordFeedbackStatus.PROCESSING_ERROR
                return@ItemProcessor record
            }

            val previousData = record.record?.recordFeedback?.filter {
                it.status == RecordFeedbackStatus.COMPLETED
            }?.map {
                Pair(it.data ?: "", it.aiFeedback ?: "")
            }

            val data = """
                주제: ${record.record?.data ?: ""}
                이전 대화 기록:
                ${previousData?.joinToString("\n") {
                    "유저: ${it.first}\n" +
                    "당신: ${it.second}"
                } ?: "아직 대화 기록이 없습니다."}
                
                이번 유저의 대화:
                ${record.data}
            """.trimIndent()

            val aiResponse = chatClient
                .prompt(prompt)
                .user(data)
                .call()
                .content()

            record.aiFeedback = aiResponse
            record.status = RecordFeedbackStatus.COMPLETED

            record
        }
    }

    @Bean
    fun recordFeedbackWriter(): ItemWriter<RecordFeedback> {
        return ItemWriter { items ->
            // 처리 완료 후 DB 업데이트, 로그 기록 등 필요한 로직 구현
            // 예시로 단순 로그 출력
            items.forEach { record ->
                println("Processed RecordFeedback id: ${record.id}")
            }
        }
    }
}
