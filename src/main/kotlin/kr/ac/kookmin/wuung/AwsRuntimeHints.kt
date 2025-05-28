package kr.ac.kookmin.wuung

import org.springframework.aot.hint.RuntimeHints
import org.springframework.aot.hint.RuntimeHintsRegistrar
import org.springframework.context.annotation.Configuration
import org.springframework.context.annotation.ImportRuntimeHints

@Configuration
@ImportRuntimeHints(AwsRuntimeHints::class)
class AwsRuntimeHintsConfig

class AwsRuntimeHints : RuntimeHintsRegistrar {
    override fun registerHints(hints: RuntimeHints, classLoader: ClassLoader?) {
        hints.resources().registerPattern("io/awspring/cloud/core/SpringCloudClientConfiguration.properties")
        hints.resources().registerPattern("io/awspring/cloud/s3/S3ObjectContentTypeResolver.properties")
    }
}
