import org.gradle.kotlin.dsl.withType
import org.springframework.boot.gradle.tasks.bundling.BootBuildImage

plugins {
	kotlin("jvm") version "2.1.10"
	kotlin("plugin.spring") version "2.1.10"
	id("org.hibernate.orm") version "6.5.2.Final"
	id("org.springframework.boot") version "3.4.5"
	id("io.spring.dependency-management") version "1.1.7"
	id("org.graalvm.buildtools.native") version "0.10.5"
}

group = "kr.ac.kookmin"
version = "0.0.1-SNAPSHOT"

java {
	toolchain {
		languageVersion = JavaLanguageVersion.of(21)
	}
}

hibernate {
	enhancement {
		enableAssociationManagement.set(false)
	}
}

repositories {
	mavenCentral()
	maven { url = uri("https://repo.spring.io/milestone") }
	maven { url = uri("https://git.mori.space/api/packages/dalbodeule/maven") }
	google()
}

extra["springAiVersion"] = "1.0.0-M4"
extra["springCloudVersion"] = "2023.0.0"

dependencies {
	implementation("org.springframework.boot:spring-boot-starter-actuator")
	implementation("org.springframework.boot:spring-boot-starter-batch")
	implementation("org.springframework.boot:spring-boot-starter-data-jpa")
	implementation("org.springframework.boot:spring-boot-starter-data-redis")
	implementation("org.springframework.boot:spring-boot-starter-security")
	implementation("org.jetbrains.kotlin:kotlin-reflect")
	implementation("org.springframework.boot:spring-boot-starter-websocket")
	implementation("org.springdoc:springdoc-openapi-starter-webmvc-ui:2.8.6")

	implementation("io.swagger.core.v3:swagger-core:2.2.30")
	implementation("io.swagger.core.v3:swagger-annotations:2.2.30")

	// https://mvnrepository.com/artifact/jakarta.websocket/jakarta.websocket-api
	implementation("jakarta.websocket:jakarta.websocket-api:2.2.0")

	implementation("io.github.cdimascio:dotenv-kotlin:6.4.1")

	// https://mvnrepository.com/artifact/io.jsonwebtoken/jjwt-api
	implementation("io.jsonwebtoken:jjwt-api:0.12.6")
	// https://mvnrepository.com/artifact/io.jsonwebtoken/jjwt-impl
	implementation("io.jsonwebtoken:jjwt-impl:0.12.6")
	// https://mvnrepository.com/artifact/io.jsonwebtoken/jjwt-gson
	implementation("io.jsonwebtoken:jjwt-gson:0.12.6")

	developmentOnly("org.springframework.boot:spring-boot-docker-compose")
	runtimeOnly("io.micrometer:micrometer-registry-prometheus")
	runtimeOnly("org.postgresql:postgresql:42.7.4")

	// https://mvnrepository.com/artifact/org.springframework.cloud/spring-cloud-starter-aws
	implementation("org.springframework.cloud:spring-cloud-starter-aws:2.2.6.RELEASE")

	implementation("jakarta.xml.bind:jakarta.xml.bind-api:4.0.2")
	implementation("javax.xml.bind:jaxb-api:2.3.1")

	implementation("ch.veehait.devicecheck:devicecheck-appattest:0.9.6")

	implementation("org.springframework.ai:spring-ai-openai-spring-boot-starter:${property("springAiVersion")}")
	implementation("org.springframework.ai:spring-ai-core:${property("springAiVersion")}")

	implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.10.2")

	implementation("com.google.auth:google-auth-library-oauth2-http:1.34.0")

	// Google Play Integrity API 클라이언트 라이브러리
	implementation("com.google.android.play:integrity:1.4.0")

	// HTTP 클라이언트
	implementation("org.springframework.boot:spring-boot-starter-webflux")

	implementation("space.mori.dalbodeule:snap-admin:0.5.20")

	testImplementation("org.springframework.boot:spring-boot-starter-test")
	testImplementation("org.jetbrains.kotlin:kotlin-test-junit5")
	testImplementation("org.springframework.batch:spring-batch-test")
	testImplementation("org.springframework.security:spring-security-test")
	testRuntimeOnly("org.junit.platform:junit-platform-launcher")
}

tasks.named<org.springframework.boot.gradle.tasks.run.BootRun>("bootRun") {
	systemProperty("spring.profiles.active", "dev")
}

kotlin {
	compilerOptions {
		freeCompilerArgs.addAll("-Xjsr305=strict")
	}
}

tasks.withType<Test> {
	useJUnitPlatform()
}

tasks.withType<BootBuildImage> {
	val dockerId =
		System.getenv("DOCKER_USERNAME") ?: "docker.mori.space"
	val buildNumber =
		System.getenv("BUILD_TAG") ?: "test"

	val dockerName = "wuung-backend"
	imagePlatform = "linux/amd64"

	docker {
		publish = false
	}

	imageName.set("$dockerId/$dockerName")
	tags.set(
		setOf(
			"$dockerId/$dockerName:latest",
			"$dockerId/$dockerName:${buildNumber}"
		)
	)
	buildpacks.set(setOf("docker.io/paketobuildpacks/oracle", "urn:cnb:builder:paketo-buildpacks/java-native-image"))

	environment = mapOf(
		"BP_NATIVE_IMAGE" to "true",
		"BP_NATIVE_IMAGE_BUILD_ARGUMENTS" to "-H:+UnlockExperimentalVMOptions",
		"BP_JVM_TYPE" to "JDK",
		"BP_JVM_VERSION" to "21",
        "SPRING_PROFILES_ACTIVE" to "dev"
	)
}

hibernate {
	enhancement {
		enableAssociationManagement.set(true)
	}
}
