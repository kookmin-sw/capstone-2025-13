package kr.ac.kookmin.wuung.batch

import groovy.util.logging.Slf4j
import kr.ac.kookmin.wuung.model.TopicFeedback
import kr.ac.kookmin.wuung.model.TopicFeedbackStatus
import kr.ac.kookmin.wuung.repository.TopicFeedbackRepository
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
class TopicBatch(
    @Autowired private val topicFeedbackRepository: TopicFeedbackRepository,
    @Autowired private val chatClient: ChatClient,
    @Qualifier("getRecordPrompt") @Autowired private val recordPrompt: String
) {
    companion object {
        private const val CHUNK_SIZE = 10
    }

    @Bean("topicJob")
    fun topicJob(
        jobRepository: JobRepository,
        transactionManager: PlatformTransactionManager,
        processTopicStep: Step,
    ): Job {
        return JobBuilder("topicJob", jobRepository)
            .start(processTopicStep(
                jobRepository, transactionManager
            ))
            .build()
    }

    @Bean
    fun processTopicStep(jobRepository: JobRepository, transactionManager: PlatformTransactionManager): Step {
        return StepBuilder("processTopicStep", jobRepository)
            .chunk<TopicFeedback, TopicFeedback>(CHUNK_SIZE, transactionManager)
            .reader(topicFeedbackReader())
            .processor(topicFeedbackProcessor())
            .writer(topicFeedbackWriter())
            .build()
    }

    @Bean
    fun topicFeedbackReader(): RepositoryItemReader<TopicFeedback> {
        val sortKeys = hashMapOf("createdAt" to Sort.Direction.ASC)

        return RepositoryItemReaderBuilder<TopicFeedback>()
            .name("recordFeedbackReader")
            .repository(topicFeedbackRepository)
            .methodName("findTopicFeedbacksByStatus")
            .arguments(listOf(TopicFeedbackStatus.QUEUED))
            .sorts(sortKeys)
            .pageSize(10)
            .build()
    }

    @Bean
    fun topicFeedbackProcessor(): ItemProcessor<TopicFeedback, TopicFeedback> {
        return ItemProcessor { record ->
            val prompt = recordPrompt.trimIndent()

            if(record.status == TopicFeedbackStatus.PROCESSING || record.status == TopicFeedbackStatus.COMPLETED || record.status == TopicFeedbackStatus.NOFEEDBACK)
                return@ItemProcessor record

            record.status = TopicFeedbackStatus.PROCESSING
            if(record.data?.isBlank() == true) {
                TopicFeedbackStatus.PROCESSING_ERROR
                return@ItemProcessor record
            }

            val previousData = record.topic?.topicFeedback?.filter {
                it.status == TopicFeedbackStatus.COMPLETED
            }?.map {
                Pair(it.data ?: "", it.aiFeedback ?: "")
            }

            val data = """
                주제: ${record.topic?.data ?: ""}
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
            record.status = TopicFeedbackStatus.COMPLETED

            record
        }
    }

    @Bean
    fun topicFeedbackWriter(): ItemWriter<TopicFeedback> {
        return ItemWriter { items ->
            // 처리 완료 후 DB 업데이트, 로그 기록 등 필요한 로직 구현
            // 예시로 단순 로그 출력
            items.forEach { record ->
                println("Processed TopicFeedback id: ${record.id}")
            }
        }
    }
}
