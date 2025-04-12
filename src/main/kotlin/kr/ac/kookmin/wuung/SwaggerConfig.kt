package kr.ac.kookmin.wuung

import io.swagger.v3.oas.models.Components
import io.swagger.v3.oas.models.OpenAPI
import io.swagger.v3.oas.models.info.Info
import io.swagger.v3.oas.models.security.SecurityRequirement
import io.swagger.v3.oas.models.security.SecurityScheme
import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class SwaggerConfig(
    @Value("\${etc.host")
    private val host: String
) {
    private val securitySchemeName = "api token"

    @Bean
    fun openAPI(): OpenAPI {
        return OpenAPI()
            .info(Info().title("Wuung API Server").version("v1.0.0"))
            .servers(host.split(",").mapNotNull { it.trim() }.map { io.swagger.v3.oas.models.servers.Server().url(it) })
            .addSecurityItem(SecurityRequirement().addList(securitySchemeName))
            .components(Components()
                .addSecuritySchemes(securitySchemeName,
                    SecurityScheme()
                        .name(securitySchemeName)
                        .type(SecurityScheme.Type.HTTP)
                        .scheme("bearer")
                )
            )
    }
}