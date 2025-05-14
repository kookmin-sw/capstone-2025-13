package kr.ac.kookmin.wuung.config

import kr.ac.kookmin.wuung.model.ConfigurationKey
import kr.ac.kookmin.wuung.repository.ConfigurationsRepository
import org.springframework.ai.chat.client.ChatClient
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class ChatClientConfig(
    @Autowired private val configurationsRepository: ConfigurationsRepository
) {
    @Bean
    fun chatClient(builder: ChatClient.Builder): ChatClient = builder.build()

    @get:Bean
val recordPrompt: String
        get() {
            configurationsRepository.findByKey(ConfigurationKey.RECORD_PROMPT)
                .orElseThrow { RuntimeException("Record Prompt is not configured") }
                .let {
                    return it.value ?: throw RuntimeException("Record Prompt is not configured")
                }
        }
    @get:Bean
    val luckyVickyPrompt: String
        get() {
            configurationsRepository.findByKey(ConfigurationKey.LUCKY_VICKY)
                .orElseThrow { RuntimeException("Lucky Vicky Prompt is not configured") }
                .let {
                    return it.value ?: throw RuntimeException("Lucky Vicky Prompt is not configured")
                }
        }
}