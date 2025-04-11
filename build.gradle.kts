import org.gradle.kotlin.dsl.withType
import org.springframework.boot.gradle.tasks.bundling.BootBuildImage

plugins {
	kotlin("jvm") version "2.1.10"
	kotlin("plugin.spring") version "2.1.10"
	id("org.hibernate.orm") version "6.5.2.Final"
	id("org.springframework.boot") version "3.4.3"
	id("io.spring.dependency-management") version "1.1.7"
	id("org.graalvm.buildtools.native") version "0.10.5"

	id("co.uzzu.dotenv.gradle") version "4.0.0"
}

group = "kr.ac.kookmin"
version = "0.0.1-SNAPSHOT"

java {
	toolchain {
		languageVersion = JavaLanguageVersion.of(21)
	}
}

repositories {
	mavenCentral()
	maven { url = uri("https://repo.spring.io/milestone") }
}

extra["springAiVersion"] = "1.0.0-M4"

dependencies {
	implementation("org.springframework.boot:spring-boot-starter-actuator")
	implementation("org.springframework.boot:spring-boot-starter-batch")
	implementation("org.springframework.boot:spring-boot-starter-data-jpa")
	implementation("org.springframework.boot:spring-boot-starter-data-redis")
	implementation("org.springframework.boot:spring-boot-starter-security")
	implementation("org.jetbrains.kotlin:kotlin-reflect")
	implementation("org.springframework.boot:spring-boot-starter-websocket")
	implementation("org.springdoc:springdoc-openapi-starter-webmvc-ui:2.0.2")

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
		System.getenv("DOCKER_USERNAME") ?: env.DOCKER_USERNAME ?: "nrt.vultrcr.com/chibot"
	val buildNumber =
		System.getenv("BUILD_NUMBER") ?: "test"

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
	)
}

hibernate {
	enhancement {
		enableAssociationManagement.set(true)
	}
}
